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
      urlCreate: '/investments',
      urlGet: '/investments/',
      urlDelete: '/investments/'
    });

    this.after('initialize', function () {
      this.on('ui-add_investment', this.handleSearchedInvestment);
      this.on('ui-get_investment', this.handleGetInvestment);
      this.on('ui-delete_investment', this.handleDeleteInvestment);
    });

    /**
     * Will  handle whenver an attempt to add an investment.
     *
     * @param {Object} ev Jquery event object.
     * @param {Object} data The data payload to create investment with.
     */
    this.handleSearchedInvestment = function(ev, data) {
      if (!data || !data.investment || 
            (typeof data.investment.symbol !== 'string')) {
        this.trigger('data-invalid_investment');
        return;
      }
      
      var self = this;

      this.createInvestment(data.investment, {
        success: function(resp) {
          self.trigger('data-added_investment', resp);
        },
        error: function(resp) {
          self._handleError(resp);
        }
      });
    };

    this.handleGetInvestment = function(ev, data) {
      if (!data || !data.investment || 
            (typeof data.investment.symbol !== 'string')) {
        this.trigger('data-invalid_investment');
        return;
      }
      var self = this;

      this.getInvestment(data.investment, {
        success: function(resp) {
          self.trigger('data-got_investment', resp);
        },
        error: function(resp) {
          self._handlerError(resp);
        }
      });
    };

    /**
     * Handle when the ui wants to delete an investment.
     *
     * @param {Object} ev jQuery event object
     * @param {Object} data Data object, should contain symbol to be deleted.
     */
    this.handleDeleteInvestment = function(ev, data) {
      if (!data || !data.investment || 
            (typeof data.investment.symbol !== 'string')) {
        this.trigger('data-invalid_investment');
        return;
      }
      var self = this;

      this.deleteInvestment(data.investment.symbol, {
        success: function(resp) {
          self.trigger('data-deleted_investment', resp);
        },
        error: function(resp) {
          self._handleError(resp);
        }
      });
    };

    /**
     * Creates a new investment
     *
     * Executes a post request to /investments with following payload:
     *  schema: investmentRequest
     *
     *  @param {Object} data The data object containing symbol and possible
     *  group
     *  @param {Object} opts Hash containing just succes and error handlers.
     */
    this.createInvestment = function(data, opts) {
      var self = this,
          opts = opts || {};

      this.post({
        url: this.attr.urlCreate,
        data: data,
        success: function(resp) {
          var investment = self._setTimeStampOnInvestment(resp.investment);
          opts.success && opts.success({investment: investment});
        },
        error: function(resp) {
          opts.error && opts.error(resp);
        }
      });
    };

    /**
     * Get an investment.
     * 
     * @param {Object} data Investment data
     *   !schema investment request.
     */
    this.getInvestment = function(data, opts) {
      var self = this,
          opts = opts || {};

      console.log(data);
      this.get({
        url: this.attr.urlGet + data.symbol,
        success: function(resp) {
          var investment = self._setTimeStampOnInvestment(resp.investment);
          opts.success && opts.success({investment: investment});
        },
        error: function(resp) {
          opts.error && opts.error(resp);
        }
      });

    };

    /**
     * Deletes a symbol.
     *
     * Executes a delete request to /symbol/{sym}.
     *
     *  @param {String} symbolName The symbol 3-4 letter name.
     *  @param {Object} opts Hash containing just succes and error handlers.
     */
    this.deleteInvestment = function(symbolName, opts) {
      var opts = opts || {};

      this.destroy({
        url: this.attr.urlDelete + symbolName,
        success: function(resp) {
          opts.success && opts.success(resp);
        },
        error: function(resp) {
          opts.error && opts.error(resp);
        }
      });
    };

    /**
     * Set the timestamp and formatted timestamp on each field in the
     * investment.
     *
     * @param {Object} investment The investment oject to add timestamp to.
     *
     * @return {Object} Modified investment.
     */
    this._setTimeStampOnInvestment = function(investment) {
      var timestamp = new Date(),
          formattedTimestamp,
          key,
          field;

      if (!investment.fields) {
        return investment;
      }

      formattedTimestamp =
        timestamp.getMonth() + '/' +
        timestamp.getDate() + '/' + 
        timestamp.getFullYear();
      
      for (key in investment.fields) {
        if (investment.fields.hasOwnProperty(key)) {
          field = investment.fields[key];

          if (field.val) {
            field.updatedAt = timestamp;
            field.updatedAtFormatted = formattedTimestamp;
          }
        }
      }

      return investment;
    };

    this._handleError = function(resp) {
      if (resp.statusCode >= 400 && resp.statusCode < 500) {
        this.trigger('data-invalid_investment', resp);
      }
      if (resp.statusCode >= 500) {
        this.trigger('data-failed_request', resp);
      }
    };
  }

});
