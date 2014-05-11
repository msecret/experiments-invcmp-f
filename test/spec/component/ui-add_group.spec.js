'use strict';

describeComponent('component/ui-add_group', function () {

  // Initialize the component and attach it to the DOM
  beforeEach(function () {
    var fixture = '<form style="display: none;">'+
                    '<input type="text" class="js-groupInput" />'+
                    '<p class="js-warningEmptyGroup warning hidden">The group '+
                      'field is empty</p>'+
                    '<p class="js-warningDuplicateGroup warning hidden">A group '+
                      'with that name already exists</p>'+
                    '<input class="js-submit" type="submit" />'+
                    '<button class="js-cancelButton">cancel</button>'+
                    '<i class="js-loadingIcon" class="hidden"></i>'+
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
    it('should trigger a ui-add_group event on itself', function() {
      var eventSpy;

      eventSpy = spyOnEvent(this.$node, 'ui-add_group');
      this.$node.select('selectorGroupInput').val('dummyGroup');

      this.$node.trigger('submit');

      expect(eventSpy).toHaveBeenTriggeredOn(this.$node);
    });
    it('should pass the text input value in the event', function() {
      var eventSpy,
          expected = 'testGroup';

      eventSpy = spyOnEvent(this.$node, 'ui-add_group');
      this.component.select('selectorGroupInput').val(expected);

      this.$node.trigger('submit');

      expect(eventSpy.mostRecentCall.data).toEqual({group: expected});
    });
  });

  describe('on data-added_group', function() {
    it('should hide the loading icon', function() {
      this.$node.select('selectorLoadingIcon').show(); // Ensure already showing.

      this.$node.trigger('data-added_group');

      expect(this.$node.select('selectorLoadingIcon').is(':hidden'))
        .toBeTruthy();
    });
    it('should hide itself', function() {
      this.$node.trigger('data-added_group');

      expect(this.$node.is(':hidden')).toBeTruthy();
    });
  });

  describe('on data-invalid_group', function() {
    it('should clear the text input', function() {
      var $groupInput = this.$node.select('selectorGroupInput');

      $groupInput.val('something');
      
      this.$node.trigger('data-invalid_group');

      expect($groupInput.val()).toEqual('');
    });
    it('should put a warning class on the text input', function() {
      var $groupInput = this.$node.select('selectorGroupInput');

      $groupInput.toggleClass('warning', false); // Ensure not present.
      
      this.$node.trigger('data-invalid_group');

      expect($groupInput.hasClass('warning')).toBeTruthy();
    });
    it('should show the empty warning message if the reason: empty', function() {
      var $groupWarning = this.$node.select('selectorWarningEmptyGroup');

      $groupWarning.toggleClass('hidden', true);

      this.$node.trigger('data-invalid_group', {reason: 'empty'});

      expect($groupWarning.is(':hidden')).toBeFalsy();
    });
    it('should show the duplicate warning message if the reason: duplicate',
       function() {
      var $groupWarning = this.$node.select('selectorWarningEmptyGroup');

      $groupWarning.toggleClass('hidden', true);

      this.$node.trigger('data-invalid_group', {reason: 'duplicate'});

      expect($groupWarning.is(':hidden')).toBeFalsy();

    });
    it('should hide the loading icon', function() {
      this.$node.select('selectorLoadingIcon').show(); // Ensure already showing.

      this.$node.trigger('data-added_group');

      expect(this.$node.select('selectorLoadingIcon').is(':hidden'))
        .toBeTruthy();
    });
  });

  describe('on data-loading_group', function() {
    it('should unhide a spinner on the form', function() {

      this.$node.select('selectorLoadingIcon').hide(); // Unsure hidden in test.

      this.$node.trigger('data-loading_group');

      expect(this.$node.select('selectorLoadingIcon').is(':hidden'))
        .toBeFalsy();
    });
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
