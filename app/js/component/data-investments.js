define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');
  var withRequest = require('flight-request/lib/with_request');

  /**
   * Module exports
   */

  return defineComponent(dataInvestments, withRequest);

  /**
   * Module function
   */

  function dataInvestments() {
    this.defaultAttrs({
      urlCreate: '/symbols'
    });

    this.after('initialize', function () {
      this.on('ui-add_symbol', this.handleSearchedSymbol);
    });

    /**
     * Will  handle whenver an attempt to add a symbol.
     *
     * @param {Object} ev Jquery event object.
     * @param {Object} data The data payload to create symbol with.
     *
     * @event data-added_symbol When the request to add the symbol succeeded.
     *   resp {Object} The response object from the server
     * @event data-invalid_symbol When the data is missing, symbol is missing
     * or the symbol is not a string.
     * @event data-not_found_symbol When the symbol was not found on server.
     * @event data-failure_request When requests to the server failed.
     */
    this.handleSearchedSymbol = function(ev, data) {
      if (!data || !data.symbol || (typeof data.symbol !== 'string') ) {
        this.trigger('data-invalid_symbol');
        return;
      }
      
      var self = this;

      this.createSymbol(data, {
        success: function(resp) {
          self.trigger('data-added_symbol', resp);
        },
        error: function(resp) {
          if (resp.status === 400) {
            self.trigger('data-not_found_symbol');
          } else {
            self.trigger('data-failure_request');
          }
        }
      });
    };

    /**
     * Creates a new symbol.
     *
     * Executes a post request to /symbol with following payload:
     *   symbol: string !required
     *   group: string
     *
     *  @param {Object} data The data object containing symbol and possible
     *  group
     *  @param {Object} opts Hash containing just succes and error handlers.
     */
    this.createSymbol = function(data, opts) {
      var opts = opts || {};

      this.post({
        url: this.attr.urlCreate,
        data: data,
        success: function(resp) {
          opts.success && opts.success(resp);
        },
        error: function(resp) {
          opts.error && opts.error(resp);
        }
      });
    };
  }

});
