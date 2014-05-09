'use strict';

describeComponent('component/ui-add_group', function () {

  // Initialize the component and attach it to the DOM
  beforeEach(function () {
    var fixture = '<form style="display: none;">'+
                    '<input type="text" class="js-groupInput" />'+
                    '<input class="js-submit" type="submit" />'+
                    '<button class="js-cancelButton">cancel</button>'+
                  '</form>';
    setupComponent(fixture);
  });

  it('should be defined', function () {
    expect(this.component).toBeDefined();
  });

  describe('on ui-wanted_new_group', function() {
    it('should clear itself of any previous input', function() {
      var actual;
      
      this.$node.select('selectorGroupInput').val('poop');
      this.$node.trigger('ui-wanted_new_group');

      actual = this.$node.select('selectorGroupInput').val();

      expect(actual).toEqual('');
    });
    it('should trigger ui-activate_group_add to activate itself', function() {
      var eventSpy;

      eventSpy = spyOnEvent(this.$node, 'ui-wanted_new_group');

      this.$node.trigger('ui-wanted_new_group');

      expect(eventSpy).toHaveBeenTriggeredOn(this.$node);
    });
  });

  describe('on ui-activate_group_add', function() {
    it('should unhide itself', function() {
      this.$node.hide(); // Ensure its hidden as in index.html

      this.$node.trigger('ui-activate_group_add', 'pen15');

      expect(this.$node.is(':hidden')).toBeFalsy();
    });
  });

  describe('on submit', function() {

  });
  
  describe('on click cancel', function() {
    it('should hide itself', function() {
      this.$node.show(); // Ensure its showing, as in activated state.

      this.$node.trigger('click', this.component.attr.selectorCancelButton);

      expect(this.$node.is(':hidden')).toBeTruthy();
    });
    it('should trigger ui-deactivate_group_add', function() {
      var eventSpy;

      eventSpy = spyOnEvent(this.$node, 'ui-deactivate_group_add');

      this.$node.trigger('click', this.component.attr.selectorCancelButton);

      expect(eventSpy).toHaveBeenTriggeredOn(this.$node);
    });
  });
});
