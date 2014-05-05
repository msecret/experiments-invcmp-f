'use strict';

describeComponent('component/data-symbol_finder', function () {

  // Initialize the component and attach it to the DOM
  beforeEach(function () {
    setupComponent();
  });

  it('should be defined', function () {
    expect(this.component).toBeDefined();
  });

  it('should listen for ui-add_symbol events and fire data-symbol on document',
     function() {
    var eventSpy;

    eventSpy = spyOnEvent(document, 'data-symbol');
    this.$node.trigger('ui-add_symbol', {});

    expect(eventSpy).toHaveBeenTriggeredOn(document);
  });

  it('should listen for ui-add_symbol events and fire data-symbol', function() {
    var eventSpy,
        testSymbol;

    testSymbol = 'TST';
    eventSpy = spyOnEvent(document, 'data-symbol');
    this.$node.trigger('ui-add_symbol', {
      symbol: testSymbol
    });

    expect(eventSpy.mostRecentCall.data).toEqual({
      symbol: {symbol: testSymbol}
    });
  });
});
