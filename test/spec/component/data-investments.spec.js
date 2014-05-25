'use strict';

describeComponent('component/data-investments', function () {

  // Initialize the component and attach it to the DOM
  beforeEach(function () {
    setupComponent();
  });

  it('should be defined', function () {
    expect(this.component).toBeDefined();
  });

  describe('on ui-add_symbol', function() {
    var server;

    beforeEach(function() {
      server = sinon.fakeServer.create();
    });

    afterEach(function() {
      server.restore();
    });

    it('should trigger data-invalid_symbol if data is not truthy', function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_symbol');
      this.$node.trigger('ui-add_symbol', null);

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('shoud not trigger anything if there is no symbol in data', function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_symbol');
      this.$node.trigger('ui-add_symbol', {group: 'test'});

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should not make an ajax request if symbol is not a string', function() {
      this.$node.trigger('ui-add_symbol', {symbol: ['poop']});

      expect(server.requests.length).toEqual(0);
    });
    it('should trigger data-invalid_symbol if symbol is not a string', function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_symbol');
      this.$node.trigger('ui-add_symbol', {symbol: {}});

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should make a POST ajax call to /symbols if symbol string', function() {
      var testSymbol = 'TST';

      this.$node.trigger('ui-add_symbol', {symbol: testSymbol});

      expect(server.requests[0].url).toEqual('/symbols');
      expect(server.requests[0].method).toEqual('POST');
    });
    it('should trigger data-added_symbol with symbol data if the request '+
       'succeeded', function() {
      var testSymbol = 'TST',
          expected = {symbol: {symbol: {val: 'TST'}, group: 'test'}},
          eventSpy;

      eventSpy = spyOnEvent(document, 'data-added_symbol');
      server.respondWith('POST', '/symbols',
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify(expected)]);

      this.$node.trigger('ui-add_symbol', {symbol: testSymbol});
      server.respond();

      expect(eventSpy.mostRecentCall.data.symbol.val).toEqual(
        expected.symbol.symbol.val);
    });
    it('should leave group null if no group is present in data', function() {
      var testSymbol = 'TST',
          expected = {symbol: {symbol: {val: 'TST'}}},
          eventSpy;

      eventSpy = spyOnEvent(document, 'data-added_symbol');
      server.respondWith('POST', '/symbols',
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify(expected)]);

      this.$node.trigger('ui-add_symbol', {symbol: testSymbol});
      server.respond();

      expect(eventSpy.mostRecentCall.data.symbol.val).toEqual(testSymbol);
    });
    it('should fire data-not_found_symbol when server returns 400 failures',
       function() {
      var testSymbol = 'TST',
          eventSpy;

      eventSpy = spyOnEvent(document, 'data-not_found_symbol');
      server.respondWith('POST', '/symbols',
                              [400, { 'Content-Type': 'application/json' },
                               '']);

      this.$node.trigger('ui-add_symbol', {symbol: testSymbol});
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);

    });
    it('should fire data-failed_request when server returns failure but 400', 
       function() {
      var testSymbol = 'TST',
          eventSpy;

      eventSpy = spyOnEvent(document, 'data-failed_request');
      server.respondWith('POST', '/symbols',
                              [500, { 'Content-Type': 'application/json' },
                               '']);

      this.$node.trigger('ui-add_symbol', {symbol: testSymbol});
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
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

    it('should request a DELETE on /symbols/{name}', function() {
      var expected = {symbol: 'SYN'};

      this.$node.trigger('ui-delete_symbol', expected);

      expect(server.requests[0]).toBeDefined();
      expect(server.requests[0].url).toEqual('/symbols/'+ expected.symbol);
      expect(server.requests[0].method).toEqual('POST');
    });
    it('should trigger a data-deleted_symbol on document with the symbol',
       function() {
      var testSymbol = 'TST',
          expected = {symbol: 'DDC'},
          eventSpy;

      eventSpy = spyOnEvent(document, 'data-deleted_symbol');
      server.respondWith('POST', '/symbols/'+ expected.symbol,
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify(expected)]);

      this.$node.trigger('ui-delete_symbol', expected);
      server.respond();

      expect(eventSpy.mostRecentCall.data).toEqual(expected);
    });
    it('should trigger a data-invalid_symbol if the symbol is missing', 
       function() {
      var testSymbol = {},
          eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_symbol');

      this.$node.trigger('ui-delete_symbol', testSymbol);

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should trigger a data-invalid_symbol if the symbol is not a string', 
       function() {
      var testSymbol = {symbol: {}},
          eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_symbol');

      this.$node.trigger('ui-delete_symbol', testSymbol);

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should trigger a data-failed_symbol reason:not found if the server'+ 
       'returns 404', function() {
      var testSymbol = {symbol: 'TST'},
          eventSpy;

      eventSpy = spyOnEvent(document, 'data-failed_symbol');
      server.respondWith('DELETE', '/symbols/'+ testSymbol.symbol,
                              [404, { 'Content-Type': 'application/json' },
                               '']);

      this.$node.trigger('ui-delete_symbol', testSymbol);
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
      expect(eventSpy.mostRecentCall.data.reason).toEqual('not found');
    });
    it('should trigger a data-failed_request if server returns 500', function() {
      var testSymbol = {symbol: 'MMN'},
          eventSpy;

      eventSpy = spyOnEvent(document, 'data-failed_request');
      server.respondWith('POST', '/symbols/'+ testSymbol.symbol,
                              [503, { 'Content-Type': 'application/json' },
                               'Server Error']);

      this.$node.trigger('ui-delete_symbol', testSymbol);
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
  });
});
