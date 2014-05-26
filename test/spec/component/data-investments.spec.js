'use strict';

describeComponent('component/data-investments', function () {
  var testInvestmentRequest,
      testInvestment;

  // Initialize the component and attach it to the DOM
  beforeEach(function () {
    setupComponent();
    testInvestmentRequest = { symbol: 'TST',
      group: {name: 'TGroup'}
    };
    testInvestment = {
      symbol: 'TST',
      group: {name: 'TGroup'},
      fields: {
        symbol: {val: 'TST'}
      }
    };
  });

  it('should be defined', function () {
    expect(this.component).toBeDefined();
  });

  describe('on ui-add_investment', function() {
    var server,
        clock;

    beforeEach(function() {
      server = sinon.fakeServer.create();
      clock = sinon.useFakeTimers(0);
    });

    afterEach(function() {
      server.restore();
      clock.restore();
    });

    it('should trigger data-invalid_investment if data is not truthy',
       function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_investment');
      this.$node.trigger('ui-add_investment', null);

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('shoud not trigger anything if there is no symbol in data', function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_investment');
      this.$node.trigger('ui-add_investment', {investment: {}});

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should not make an ajax request if symbol is not a string', function() {
      this.$node.trigger('ui-add_symbol', {investment: {symbol: []}});

      expect(server.requests.length).toEqual(0);
    });
    it('should trigger data-invalid_investment if symbol is not a string',
       function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_investment');
      this.$node.trigger('ui-add_investment', {investment: {symbol: 1}});

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should make a POST ajax call to /investments if symbol string', 
       function() {
      this.$node.trigger('ui-add_investment', {investment: 
                                               testInvestmentRequest});

      expect(server.requests[0].url).toEqual('/investments');
      expect(server.requests[0].method).toEqual('POST');
    });
    it('should trigger data-added_investment with investment data if the request'+
       ' succeeded', function() {
      var testInvestmentRequest,
          expected,
          eventSpy;

      testInvestmentRequest = {
        symbol: 'TNT',
        group: {name: 'TGroup1'}
      };
      expected = {
        symbol: 'TNT',
        group: {name: 'TGroup1'},
        fields: {
          symbol: {val: 'TNT'}
        }

      };
      eventSpy = spyOnEvent(document, 'data-added_investment');
      server.respondWith('POST', '/investments',
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify({investment: expected})]);

      this.$node.trigger('ui-add_investment', 
                        {investment: testInvestmentRequest});
      server.respond();

      expect(eventSpy.mostRecentCall.data.investment.symbol).toEqual(
        expected.symbol);
    });
    it('should leave group null if no group is present in data', function() {
      var testInvestmentRequest,
          expected,
          eventSpy;

      testInvestmentRequest = {
        symbol: 'TNT'
      };
      expected = {
        symbol: 'TNT',
        fields: {
          symbol: {val: 'TNT'}
        }
      };

      eventSpy = spyOnEvent(document, 'data-added_investment');
      server.respondWith('POST', '/investments',
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify({investment: expected})]);

      this.$node.trigger('ui-add_investment', 
                        {investment: testInvestmentRequest});
      server.respond();

      expect(eventSpy.mostRecentCall.data.investment.symbol).toEqual(
        expected.symbol);
    });
    it('should fire data-invalid_investment with status code when server returns'+
       '404 failures', function() {
      var eventSpy,
          expected;

      expected = {
        statusCode: 404,
        message: 'not found'
      };
      eventSpy = spyOnEvent(document, 'data-invalid_investment');
      server.respondWith('POST', '/investments',
                              [404, { 'Content-Type': 'application/json' },
                               JSON.stringify(expected)]);

      this.$node.trigger('ui-add_investment', 
                         {investment: testInvestmentRequest});
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should fire data-failed_request when server returns failure over 500', 
       function() {
      var eventSpy,
          expected;

      expected = {
        statusCode: 500,
        message: 'not found'
      };
      eventSpy = spyOnEvent(document, 'data-failed_request');
      server.respondWith('POST', '/investments',
                              [500, { 'Content-Type': 'application/json' },
                               JSON.stringify(expected)]);

      this.$node.trigger('ui-add_investment', 
                         {investment: testInvestmentRequest});
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should update the updatedAt timestamp on on fields', function() {
      var testInvestmentRequest,
          testInvestment,
          expected,
          eventSpy,
          actual;

      testInvestmentRequest = {
        symbol: 'MNT'
      };
      clock.tick(50);
      expected = new Date();
      testInvestment = {
        symbol: 'MNT',
        fields: {
          symbol: {val: 'MNT'},
          cap: {val: 100}
        }
      };

      eventSpy = spyOnEvent(document, 'data-added_investment');
      server.respondWith('POST', '/investments',
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify({investment: testInvestment})]);

      this.$node.trigger('ui-add_investment', 
                        {investment: testInvestmentRequest});
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
      actual = eventSpy.mostRecentCall.data.investment; 
      expect(actual.fields.cap.updatedAt).toEqual(expected);
    });
    it('should update the updatedAtFormatted timestamp on on fields', function() {
      var testInvestmentRequest,
          testInvestment,
          expected,
          eventSpy,
          newDate,
          actual;

      testInvestmentRequest = {
        symbol: 'MNT'
      };
      clock.tick(50);
      newDate = new Date();
      expected =
        newDate.getMonth() + '/' +
        newDate.getDate() + '/' + 
        newDate.getFullYear();
      testInvestment = {
        symbol: 'MNT',
        fields: {
          symbol: {val: 'MNT'},
          cap: {val: 100}
        }
      };

      eventSpy = spyOnEvent(document, 'data-added_investment');
      server.respondWith('POST', '/investments',
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify({investment: testInvestment})]);

      this.$node.trigger('ui-add_investment', 
                        {investment: testInvestmentRequest});
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
      actual = eventSpy.mostRecentCall.data.investment; 

      expect(actual.fields.cap.updatedAtFormatted).toEqual(expected);
    });
  });

  describe('on ui-delete_symbol', function() {
    var server;

    beforeEach(function() {
      server = sinon.fakeServer.create();
    });

    afterEach(function() {
      server.restore();
    });

    it('should request a DELETE on /investments/{name}', function() {
      var expected = {symbol: 'SYN'};

      this.$node.trigger('ui-delete_investment', 
                         {investment: testInvestmentRequest});

      expect(server.requests[0]).toBeDefined();
      expect(server.requests[0].url).toEqual(
        '/investments/'+ testInvestmentRequest.symbol);
      expect(server.requests[0].method).toEqual('POST');
    });
    it('should trigger a data-deleted_symbol on document with the symbol',
       function() {
        var eventSpy,
            expected;

      expected = { 
        symbol: 'TMT',
        group: {name: 'TGroup3'}
      };

      eventSpy = spyOnEvent(document, 'data-deleted_investment');
      server.respondWith('POST', '/investments/'+ expected.symbol,
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify(expected)]);

      this.$node.trigger('ui-delete_investment', {investment: expected});
      server.respond();

      expect(eventSpy.mostRecentCall.data).toEqual(expected);
    });
    it('should trigger a data-invalid_investment if the symbol is missing', 
       function() {
      var testInvestment = {group: 'Groupa'},
          eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_investment');

      this.$node.trigger('ui-delete_investment', {investment: testInvestment});

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should trigger a data-invalid_investment if the symbol is not a string', 
       function() {
      var testInvestment = {group: 'Groupa', symbol: 1},
          eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_investment');

      this.$node.trigger('ui-delete_investment', testInvestment);

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should trigger a data-invalid_investment reason:not found if the server'+ 
       'returns 404', function() {
      var eventSpy,
          expected;

      expected = {
        investment: testInvestmentRequest,
        status: 404,
        statusCode: 404,
        message: 'Not Found'
      };
      eventSpy = spyOnEvent(document, 'data-invalid_investment');
      server.respondWith('POST', '/investments/'+ testInvestmentRequest.symbol,
                              [404, { 'Content-Type': 'application/json' },
                               JSON.stringify(expected)]);

      this.$node.trigger('ui-delete_investment', 
                         {investment: testInvestmentRequest});
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
      expect(eventSpy.mostRecentCall.data).toEqual(expected);
    });
    it('should trigger a data-failed_request if server returns 500', function() {
      var eventSpy,
          expected;

      expected = {
        investment: testInvestmentRequest,
        status: 500,
        statusCode: 500,
        message: 'Internal Server Error'
      };
      eventSpy = spyOnEvent(document, 'data-failed_request');
      server.respondWith('POST', '/investments/'+ testInvestmentRequest.symbol,
                              [500, { 'Content-Type': 'application/json' },
                               JSON.stringify(expected)]);

      this.$node.trigger('ui-delete_investment', 
                         {investment: testInvestmentRequest});
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
      expect(eventSpy.mostRecentCall.data).toEqual(expected);
    });
  });
});
