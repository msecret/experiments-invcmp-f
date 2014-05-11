'use strict';

describeComponent('component/data-investments', function () {

  // Initialize the component and attach it to the DOM
  beforeEach(function () {
    setupComponent();
  });

  it('should be defined', function () {
    expect(this.component).toBeDefined();
  });

  describe('on ui-searched_symbol', function() {
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
      this.$node.trigger('ui-searched_symbol', null);

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('shoud not trigger anything if there is no symbol in data', function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_symbol');
      this.$node.trigger('ui-searched_symbol', {group: 'test'});

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should not make an ajax request if symbol is not a string', function() {
      this.$node.trigger('ui-searched_symbol', {symbol: ['poop']});

      expect(server.requests.length).toEqual(0);
    });
    it('should trigger data-invalid_symbol if symbol is not a string', function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_symbol');
      this.$node.trigger('ui-searched_symbol', {symbol: {}});

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should make a POST ajax call to /symbols if symbol string', function() {
      var testSymbol = 'TST';

      this.$node.trigger('ui-searched_symbol', {symbol: testSymbol});

      expect(server.requests[0].url).toEqual('/symbols');
      expect(server.requests[0].method).toEqual('POST');
    });
    it('should trigger data-added_symbol with symbol data if the request '+
       'succeeded', function() {
      var testSymbol = 'TST',
          expected = {symbol: 'TST', group: 'test'},
          eventSpy;

      eventSpy = spyOnEvent(document, 'data-added_symbol');
      server.respondWith('POST', '/symbols',
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify(expected)]);

      this.$node.trigger('ui-searched_symbol', {symbol: testSymbol});
      server.respond();

      expect(eventSpy.mostRecentCall.data).toEqual(expected);
    });
    it('should leave group null if no group is present in data', function() {
      var testSymbol = 'TST',
          expected = {symbol: 'TST'},
          eventSpy;

      eventSpy = spyOnEvent(document, 'data-added_symbol');
      server.respondWith('POST', '/symbols',
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify(expected)]);

      this.$node.trigger('ui-searched_symbol', {symbol: testSymbol});
      server.respond();

      expect(eventSpy.mostRecentCall.data).toEqual(expected);
    });
    it('should fire data-not_found_symbol when server returns 400 failures',
       function() {
      var testSymbol = 'TST',
          eventSpy;

      eventSpy = spyOnEvent(document, 'data-not_found_symbol');
      server.respondWith('POST', '/symbols',
                              [400, { 'Content-Type': 'application/json' },
                               '']);

      this.$node.trigger('ui-searched_symbol', {symbol: testSymbol});
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);

    });
    it('should fire data-failure_request when server returns failure but 400', 
       function() {
      var testSymbol = 'TST',
          eventSpy;

      eventSpy = spyOnEvent(document, 'data-failure_request');
      server.respondWith('POST', '/symbols',
                              [500, { 'Content-Type': 'application/json' },
                               '']);

      this.$node.trigger('ui-searched_symbol', {symbol: testSymbol});
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
  });

});
