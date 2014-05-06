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
    });

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
