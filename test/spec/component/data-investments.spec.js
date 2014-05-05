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
    this.$node.trigger('ui-searched_symbol', {});

    expect(eventSpy).toHaveBeenTriggeredOn(document);
  });

  it('should listen for ui-searched_symbol events and fire data-found_symbol', function() {
    var eventSpy,
        testSymbol;

    testSymbol = 'TST';
    eventSpy = spyOnEvent(document, 'data-found_symbol');
    this.$node.trigger('ui-searched_symbol', {
      symbol: testSymbol
    });

    expect(eventSpy.mostRecentCall.data).toEqual({
      symbol: {symbol: testSymbol}
    });
  });
});
