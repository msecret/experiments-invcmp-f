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

    });

    this.after('initialize', function () {
    });
  }

  /**
   * Module exports
   */
  return defineComponent(dataGroups);

});
