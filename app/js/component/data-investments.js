define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');

  /**
   * Module exports
   */

  return defineComponent(dataInvestments);

  /**
   * Module function
   */

  function dataInvestments() {
    this.defaultAttrs({

    });

    this.after('initialize', function () {
      this.on('ui-searched_symbol', this.handleSearchedSymbol);
    });

    this.handleSearchedSymbol = function(ev, data) {
      if (!data || !data.symbol) {
        return;
      }
      var symbol = data.symbol,
          group = data.group || null;

      // ajax request for data.

      this.trigger('data-found_symbol', {
        symbol: {symbol: symbol, group: group}
      });
    };
  }

});
