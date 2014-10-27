define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');
  var withRequest = require('flight-request/lib/with_request');
  var withYql = require('flight-yql/lib/with_yql');
  var config = require('component/config');

  /**
   * Module exports
   */
  return defineComponent(dataInvestments, withRequest, withYql);

  /**
   * Module function
   */
  function dataInvestments() {
    this.defaultAttrs({
      urlCreate: config.API_PREFIX + '/investments',
      urlGet: config.API_PREFIX + '/investment/',
      urlGetMultiple: config.API_PREFIX + '/investments',
      urlUpdate: config.API_PREFIX + '/investment/',
      urlDelete: config.API_PREFIX + '/investment/',
      yqlTable: 'yahoo.finance.keystats'
    });

    this.after('initialize', function () {
      this.on('ui-add_investment', this.handleSearchedInvestment);
      this.on('ui-get_investment', this.handleGetInvestment);
      this.on('ui-update_investment', this.handleUpdateInvestment);
      this.on('ui-delete_investment', this.handleDeleteInvestment);

      this.initializeInvestments();
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

      var self = this,
          investmentData = {},
          investmentRequest = data,
          yqlRequest,
          createRequest;

      yqlRequest = this.queryWithSymbol(data.investment.symbol);

      yqlRequest.done(function(yqlData) {
        var dataMixer = {fields: null};
        yqlData = yqlData.query;
        if (!yqlData.results) {
          self.trigger('data-failed_request');
          return;
        }
        dataMixer.fields = yqlData.results.stats;
        var mixedData = $.extend(investmentRequest.investment,
          dataMixer);
        investmentRequest.investment = mixedData;
        self.createInvestment(investmentRequest, {
          success: function(data) {
            self.trigger('data-added_investment', data);
          },
          error: function(resp) {
            self._handleError(resp);
          }
        });
      }).fail(function(resp) {
        self.trigger('data-invalid_investment')
        return;
      });
    };

    /**
     * Will  handle whenver an attempt to get an investment.
     *
     * @param {Object} ev Jquery event object.
     * @param {Object} data The data payload with symbol to get.
     */
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
     * Will  handle whenver an attempt to update an investment.
     *
     * @param {Object} ev Jquery event object.
     * @param {Object} data The data payload to update investment with.
     */
    this.handleUpdateInvestment = function(ev, data) {
      if (!data || !data.investment || !data.investment.id) {
        this.trigger('data-invalid_investment');
        return;
      }

      var self = this;

      this.updateInvestment(data.investment, {
        success: function(resp) {
          self.trigger('data-updated_investment', resp);
        },
        error: function(resp) {
          self._handleError(resp);
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
      if (!data || !data.investment || !data.investment.id) {
        this.trigger('data-invalid_investment');
        return;
      }
      var self = this;

      this.deleteInvestment(data.investment.id, {
        success: function(resp) {
          self.trigger('data-deleted_investment', data);
        },
        error: function(resp) {
          self._handleError(resp);
        }
      });
    };

    /**
     * Initializes investments by pulling them from the server and calling
     * the event "data-init_investments".
     */
    this.initializeInvestments = function() {
      var self = this;

      this.get({
        url: this.attr.urlGetMultiple,
        contentType: 'application/json; charset=utf-8'
      }).done(function(resp) {
        self.trigger('data-init_investments', resp.data);
      }).fail(function(resp) {
        self._handleError(resp);
      });
    };

    /**
     * Creates a new investment
     *
     * Executes a post request to /investments with following payload:
     *  schema: investmentRequest
     *
     *  @param {Object} investment The data object containing symbol and possible
     *    group
     *    !schema investmentRequest.json
     *  @param {Object} opts Hash containing just succes and error handlers.
     *
     *  @return {Object} jQuery Promise.
     */
    this.createInvestment = function(investment, opts) {
      var self = this,
          opts = opts || {};

      this.post({
        url: this.attr.urlCreate,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(investment),
      }).done(function(resp) {
        var investment = self._setTimeStampOnInvestment(resp.data.investment);
        opts.success && opts.success({investment: investment});
      }).fail(function(resp) {
        opts.error && opts.error(resp);
      });
    };

    /**
     * Updates a existing investment
     *
     * Executes a pust request to /investments/{sym} with following payload:
     *  schema: investment
     *
     *  @param {Object} investment The data object investment
     *    !schema investment.json
     *  @param {Object} opts Hash containing just success and error handlers.
     */
    this.updateInvestment = function(investment, opts) {
      var self = this,
          opts = opts || {};

      $.ajax({
        url: this.attr.urlUpdate + investment.id,
        contentType: 'application/json; charset=utf-8',
        data: investment,
        type: 'PUT',
        success: function(resp) {
          var investment = self._setTimeStampOnInvestment(resp.data.investment);
          opts.success && opts.success({investment: investment});
        },
        error: function(resp) {
          opts.error && opts.error(JSON.parse(resp.responseText));
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

      this.get({
        url: this.attr.urlGet + data.id,
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
     * Executes a delete request to /investment/{id}}.
     *
     *  @param {String} investmentId The id of the investment.
     *  @param {Object} opts Hash containing just succes and error handlers.
     */
    this.deleteInvestment = function(investmentId, opts) {
      var opts = opts || {};

      $.ajax({
        url: this.attr.urlDelete + investmentId,
        contentType: 'application/json; charset=utf-8',
        type: 'DELETE',
        success: function(resp) {
          opts.success && opts.success(resp);
        },
        error: function(resp) {
          opts.error && opts.error(JSON.parse(resp.responseText));
        }
      });
    };

    this.queryWithSymbol = function(symbol) {
      var queryStatement;
      // SELECT * FROM yahoo.finance.keystats WHERE symbol='T'

      queryStatement = 'SELECT * '+
        'FROM '+ this.attr.yqlTable + ' ' +
        'WHERE symbol=\''+ symbol + '\'';

      return this.queryYql(queryStatement);
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
      else {
        this.trigger('data-failed_request', resp);
      }
    };
  }

});
