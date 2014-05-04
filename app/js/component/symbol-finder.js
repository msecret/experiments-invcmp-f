define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */
  var defineComponent = require('flight/lib/component');

  /**
   * Module exports
   */
  return defineComponent(symbolFinder);

  /**
   * Module function
   */
  function symbolFinder() {
    this.defaultAttrs({

    });

    this.after('initialize', function () {
      this.on('ui-add_symbol', this.handleSymbolAdd);
    });

    this.handleSymbolAdd = function(ev, data) {
      var symbol = data.symbol;

      this.trigger('data-symbol', {
        symbol: {symbol: symbol}
      });
    };
  }

});
