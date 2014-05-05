define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */
  var defineComponent = require('flight/lib/component');

  /**
   * Module function
   */
  function dataGroups() {
    this.defaultAttrs({
      getAllUrl: '/user/{uid}/groups'
    });

    this.after('initialize', function () {
      // TODO flow for getting groups
      // call getGroups with callbacks to trigger events
    });

    this.getGroups = function(opts) {
      var opts = opts || {};
      this.get({
        url: this.getAllUrl,
        success: function(resp) {
          opts.success && opts.success(data);
        },
        error: function(resp) {
          opts.error && options.error(data);
        }
      });
    };
  }

  /**
   * Module exports
   */
  return defineComponent(dataGroups);

});
