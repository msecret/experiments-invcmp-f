define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */
  var defineComponent = require('flight/lib/component');
  var withRequest = require('flight-request/lib/with_request');

  /**
   * Module function
   */
  function dataGroups() {
    this.defaultAttrs({
      getAllUrl: '/groups'
    });

    this.after('initialize', function () {
      // TODO flow for getting groups
      // call getGroups with callbacks to trigger events
      this.groups = [];
      this.on('ui-add_group', this.handleAddGroup);
    });

    this.handleAddGroup = function(ev, data) {
      var group = data.group;
      this.trigger('data-loading_group');

      this.addGroup(group);
    };

    /**
     * Adds a group to the list of groups. Checks that the group is not empty
     * and the  group is not a duplicate.
     *
     * @param {String} group The group to add.
     */
    this.addGroup = function(group) {
      if (!group) {
        this.trigger('data-invalid_add_group', {reason: 'empty'});
        return;
      }
      
      if ($.inArray(group, this.groups) !== -1) {
        this.trigger('data-invalid_add_group', {reason: 'duplicate'});
        return;
      }

      this.groups.push(group);
      this.trigger('data-added_group', {group: group});
      this.trigger('data-loaded_group');
    };

    this.getGroups = function(opts) {
      var opts = opts || {};
      this.get({
        url: this.attr.getAllUrl,
        success: function(resp) {
          opts.success && opts.success(resp);
        },
        error: function(resp) {
          opts.error && opts.error(resp);
        }
      });
    };
  }

  /**
   * Module exports
   */
  return defineComponent(dataGroups, withRequest);

});
