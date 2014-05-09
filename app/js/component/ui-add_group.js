define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');
  var withHogan = require('flight-hogan/lib/with_hogan');

  /**
   * Module exports
   */

  return defineComponent(uiAddGroup, withHogan);

  /**
   * Module function
   */
  function uiAddGroup() {
    this.defaultAttrs({
      selectorCancelButton: '.js-cancelButton',
      selectorGroupInput: '.js-groupInput'
    });

    this.after('initialize', function () {

      this.on('ui-activate_group_add', this.handleActivateGroupForm);
      this.on('ui-wanted_new_group', this.handleWantedNewGroup);
      this.on('click '+ this.attr.selectorCancelButton, this.handleCancel);
    });

    this.handleWantedNewGroup = function(ev, data) {
      ev.preventDefault();

      this.clearForm();

      this.trigger('ui-activate_group_add');
    };

    this.handleActivateGroupForm = function(ev, data) {
      this.$node.show();
    };

    this.handleCancel = function(ev, data) {
      ev.preventDefault();

      this.$node.hide();

      this.trigger('ui-deactivate_group_add');
    };

    this.clearForm = function() {
      this.$node.select('selectorGroupInput').val('');
    };
  }
});
