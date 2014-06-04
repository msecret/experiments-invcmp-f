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
      selectorLoadingIcon: 'js-loadingIcon',
      selectorCancelButton: '.js-cancelButton',
      selectorGroupInput: '.js-groupInput',
      selectorWarningEmptyGroup: '.js-warningEmptyGroup',
      selectorWarningDuplicateGroup: '.js-warningDuplicateGroup'
    });

    this.after('initialize', function () {
      this.on('ui-activate_group_add', this.handleActivateGroupForm);
      this.on(document, 'data-wanted_new_group', this.handleWantedNewGroup);
      this.on(document, 'data-loading_group', this.loadingStart);
      this.on(document, 'data-added_group', this.handleAddedGroup);
      this.on(document, 'data-invalid_group', this.handleInvalidGroup);
      this.on('submit', this.handleSubmit);
      this.on(this.attr.selectorCancelButton, 'click', this.handleCancel);
    });

    /**
     * Handles when there's a request to create a new group
     *
     * @param {Object} ev The jQuery event object.
     */
    this.handleWantedNewGroup = function(ev, data) {
      ev.preventDefault();

      this.clearForm();

      this.trigger('ui-activate_group_add');
    };

    /**
     * Handles the activation of the form
     */
    this.handleActivateGroupForm = function() {
      this.show();
    };

    /**
     * Handles form submission
     *
     * @param {Object} ev The jQuery event object
     */
    this.handleSubmit = function(ev) {
      ev.preventDefault();
      var group = this.select('selectorGroupInput').val();

      this.trigger('ui-add_group', {
        group: {name: group}
      });
    };

    /**
     * Handles events when the form is cancelled, ie not input.
     *
     * @param {Object} ev The jQuery event object
     */
    this.handleCancel = function(ev, data) {
      ev.preventDefault();

      this.$node.hide();

      this.trigger('ui-deactivate_group_add');
    };

    this.handleAddedGroup = function() {
      this.clearForm();
      this.select('selectorSuccessIcon').show();
      this.hide();
    };

    this.handleInvalidGroup = function(ev, data) {
      this.clearForm();
      this.select('selectorGroupInput').toggleClass('warning', true);
      if (data && data.message === 'empty') {
        this.select('selectorWarningEmptyGroup').show();
      } else if (data && data.message === 'duplicate') {
        this.select('selectorWarningDuplicateGroup').show();
      }
    };

    /**
     * Shows the form ui
     */
    this.show = function() {
      this.$node.show();
    };

    /**
     * Hides the form ui.
     */
    this.hide = function() {
      this.$node.hide();
    };

    /**
     * Clears the any input fields on the form to blank values.
     */
    this.clearForm = function() {
      this.select('selectorGroupInput').val('');
      this.select('selectorLoadingIcon').hide();
      this.select('selectorGroupInput').toggleClass('warning', false);
      this.$node.find('.warning').hide();
    };

    /**
     * Initiate any ui elements that show loading
     *
     * Currently shows a loading icon
     */
    this.loadingStart = function() {
      this.select('selectorLoadingIcon').show();
    };

    /**
     * Stop any ui that shows loading
     *
     * Currently hides a loading icon
     */
    this.loadingStop = function() {
      this.select('selectorLoadingIcon').hide();
    };
  }

});
