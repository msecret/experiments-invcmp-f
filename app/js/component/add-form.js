define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */
  var defineComponent = require('flight/lib/component');

  /**
   * Module exports
   */
  return defineComponent(addForm);

  /**
   * Module function
   */
  function addForm() {
    this.defaultAttrs({
      symbolInputSelector: '.js-symbol'
    });

    this.after('initialize', function () {
      this.on('submit', this.handleSubmit);
    });

    this.handleSubmit = function(ev) {
      ev.preventDefault();
      var symbol = this.select('symbolInputSelector').val();

      this.trigger('ui-add_symbol', {
        symbol: symbol
      });
    };
  }
});
