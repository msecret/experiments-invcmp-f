'use strict';

describeComponent('component/ui-add_form', function () {
  var testString = 'testString';

  // Initialize the component and attach it to the DOM
  beforeEach(function () {
    var fixture = '<form>'+
                    '<input type="text" class="js-symbol"'+
                      'value='+ testString +' />'+
                  '</form>';
    setupComponent(fixture);
  });

  it('should be defined', function () {
    expect(this.component).toBeDefined();
  });

  it('should listen for input submit events and trigger ui-add_symbol', 
     function() {
    var eventSpy;

    eventSpy = spyOnEvent(document, 'ui-add_symbol');
    
    this.$node.trigger('submit');

    expect(eventSpy.mostRecentCall.data).toEqual({symbol: testString});
  });
  it('should listen for input submit events and trigger even on document',
     function() {
    var eventSpy;

    eventSpy = spyOnEvent(document, 'ui-add_symbol');
    
    this.$node.trigger('submit');

    expect(eventSpy).toHaveBeenTriggeredOn(document);
  });
});
