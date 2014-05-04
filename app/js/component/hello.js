define(function (require) {
  'use strict';
  /**
   * Module dependencies
   */
  var defineComponent = require('flight/lib/component');

  /**
   * Module exports
   */
  return defineComponent(hello);

  /**
   * Module function
   */
  function hello() {
    this.defaultAttrs({

    });

    this.after('initialize', function () {
      this.$node.find('h1').text('Hello!');
    });
  }
});
