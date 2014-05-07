'use strict';

describeComponent('component/data-investments', function () {

  // Initialize the component and attach it to the DOM
  beforeEach(function () {
    setupComponent();
  });

  it('should be defined', function () {
    expect(this.component).toBeDefined();
  });

  it('should listen for ui-searched_symbol events and fire data-found_symbol on '+
     'document', function() {
    var eventSpy;

    eventSpy = spyOnEvent(document, 'data-found_symbol');
    this.$node.trigger('ui-searched_symbol', {symbol: 'LSD'});

    expect(eventSpy).toHaveBeenTriggeredOn(document);
  });

  describe('on ui-searched_symbol', function() {
    it('should not trigger anything if data is not truthy', function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-found_symbol');
      this.$node.trigger('ui-searched_symbol', null);

      expect(eventSpy).not.toHaveBeenCalled();
    });
    it('shoud not trigger anything if there is no symbol in data', function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-found_symbol');
      this.$node.trigger('ui-searched_symbol', {group: 'test'});

      expect(eventSpy).not.toHaveBeenCalled();
    });
    it('should not make an ajax request if symbol is not a string', function() {

    });
    it('should listen for ui-searched_symbol events and fire data-found_symbol', 
       function() {
      var eventSpy,
          testSymbol,
          testGroup;

      testSymbol = 'TST';
      testGroup = 'testg1';
      eventSpy = spyOnEvent(document, 'data-found_symbol');
      this.$node.trigger('ui-searched_symbol', {
        group: testGroup,
        symbol: testSymbol
      });

      expect(eventSpy.mostRecentCall.data).toEqual({
        symbol: {symbol: testSymbol, group:testGroup}
      });
    });
    it('should leave group null if no group is present in data', function() {
      var eventSpy,
          testSymbol;

      testSymbol = 'TST';
      eventSpy = spyOnEvent(document, 'data-found_symbol');
      this.$node.trigger('ui-searched_symbol', {
        symbol: testSymbol
      });

      expect(eventSpy.mostRecentCall.data).toEqual({
        symbol: {symbol: testSymbol, group: null}
      });
    });
  });
});
