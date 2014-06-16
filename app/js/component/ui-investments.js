define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */
  var defineComponent = require('flight/lib/component');
  var withHogan = require('flight-hogan/lib/with_hogan');
  var tmpltextGroupTr = require(
    'text!template/investment_list_group_tr.html');
  var tmpltextSymbolTr = require(
    'text!template/investment_list_td.html'); // TODO rename template file.


  /**
   * Module exports
   */
  return defineComponent(uiInvestments, withHogan);

  /**
   * Module function
   */
  function uiInvestments() {
    this.defaultAttrs({
      selectorGroups: '.js-investmentList_Group',
      selectorList: '.js-investmentList_Body',
      selectorEntry: '.js-investmentList_Entry',
      selectorEntryField: '.js-investmentList_Entry_Field',
      selectorEntryDelete: '.js-investmentListEntryControls-Delete', 
      selectorEntryUpdate: '.js-investmentListEntryControls-Update', 
      numCols: 18,
      tmpltextGroupTr: tmpltextGroupTr,
      tmpltextInvestmentTr: tmpltextSymbolTr
    });

    this.after('initialize', function () {
      var self = this;

      this.on(document, 'data-added_group', this.handleAddedGroup);
      this.on(document, 'data-added_investment', this.handleAddedInvestment);
      this.on(document, 'data-updated_investments', this.handleUpdatedInvestments);
      this.on(document, 'data-deleted_investment', this.handleDeletedInvestment);
      this.on(document, 'data-deleted_group', this.handleDeletedGroup);

      this.on('click', {'selectorEntryDelete': this.handleEntryDelete});
      this.on('click', {'selectorEntryUpdate': this.handleEntryUpdate});
      this.on('dblclick', {'selectorEntryField': this.handleEntryFieldUpdate});
    });

    /**
     * Helper method to find a symbol in the current list DOM
     *
     * @param {String} sym The string of the symbol to find
     */
    this.findInvestment = function(symbal) {
      return this.select('selectorList').find('tr[data-symbol="'+ symbal +'"]');
    };

    /**
     * Helper method to find a group marker in DOM.
     *
     * @param {String} groupName The name of the group to find.
     */
    this.findGroup = function(groupName) {
      return this.select('selectorList')
          .find('tr[data-groupname="'+ groupName +'"]');
    };

    /**
     * Handle data added group events. 
     */
    this.handleAddedGroup = function(ev, data) {
      this.addGroup(data.group);
      this.trigger('ui-added_group', data);
    };

    /**
     * Handle added symbol events
     */
    this.handleAddedInvestment = function(ev, data) {
      var investment;

      if (data.investment && data.investment.symbol) {
        investment = data.investment;

        if (investment.group) {
          this.addInvestmentToGroup(investment, 
                                investment.group);
        }
        else {
          this.addInvestmentNoGroup(investment);
        }

        this.trigger('ui-added_investment', data.investment);
      }
    };

    /**
     * Handle the delete button for an entry being clicked
     *
     * @param {Object} ev The jQuery event object.
     * @param {Object} el The html element being clicked.
     */
    this.handleEntryDelete = function(ev, el) {
      ev.preventDefault();
      var $target = $(ev.target).parents(this.attr.selectorEntry),
          symbol = $target.data('symbol');
      this.trigger('ui-delete_investment', {investment: 
                          {symbol: symbol}});
    };

    /**
     * Handle the update button for an entry being clicked
     *
     * @param {Object} ev The jQuery event object
     * @param {Object} el The html element being clicked.
     */
    this.handleEntryUpdate = function(ev, el) {
      ev.preventDefault();
      var $target = $(ev.target).parents(this.attr.selectorEntry),
          symbol = $target.data('symbol');
      this.trigger('ui-update_investment', {investment: 
                          {symbol: symbol}});
    };

    /**
     * Handles when an entry's field is clicked to edit the field.
     *
     * @param {Object} ev The jQuery event object
     * @param {Object} el The html element being clicked.
     */
    this.handleEntryFieldUpdate = function(ev, el) {
      ev.preventDefault();
      var $target = $(ev.target),
          symbol = $target.parents(this.attr.selectorEntry).data('symbol'),
          fieldName = $target.attr('name');

      this.trigger('ui-edit_investment_field', {investment: {
        symbol: symbol,
        field: fieldName
      }});
    };

    /**
     * Handler for when the data changes and investments are updated.
     *
     * @param {Object} ev The jQuery event object.
     * @param {Object} data The data passed, should contain investments to
     * update.
     */
    this.handleUpdatedInvestments = function(ev, data) {
      if (!data && !data.investments) {
        return;
      }

      this.updateInvestments(data.investments);
      this.trigger('ui-updated_investments', data);
    };

    /**
     * Handle an investment deleted in data.
     *
     * @param {Object} ev The jQuery event object
     * @param {Object} data The data passed, should contain symbol deleted.
     */
    this.handleDeletedInvestment = function(ev, data) {
      if (!data.investment || !data.investment.symbol) {
        return;
      }

      this.deleteInvestment(data.investment.symbol);
      this.trigger('ui-deleted_investment', {investment: data.investment});
    };

    /**
     *
     */
    this.handleDeletedGroup = function(ev, data) {
      if (!data || !data.group || !data.group.name) {
        return;
      }

      this.deleteGroup(data.group);
      this.trigger('ui-deleted_group');
    };

    /**
     * Adds a new group to the list DOM.
     *
     * @param {Object} group An object representing the group to add.
     */
    this.addGroup = function(group) {
      var context = {},
          html;

      $.extend(context, group, {numCols: this.attr.numCols});

      html = this.renderTemplate(this.attr.tmpltextGroupTr,
                                           context);

      this.select('selectorList').append(html);
    };

    /**
     * Add the symbol under its specified group in the DOM.
     *
     * @param {Object} investment The investment object to add.
     * @param {Object} group The group object.
     */
    this.addInvestmentToGroup = function(investment, group) {
      var $groupSelector,
          html;

      $groupSelector = this.findGroup(group.name);
      html = this.renderInvestment(investment);

      $groupSelector.after(html);
    };
    
    /**
     * Add the investment under no group.
     *
     * @param {Object} investment The investment object to add.
     */
    this.addInvestmentNoGroup = function(investment) {
      var html;

      html = this.renderInvestment(investment);

      this.select('selectorList').prepend(html);
    };

    /**
     * Renders a single investment with data passed in.
     *
     * @param {Object} investment Investment to render
     *    schema: investment
     *
     * @return {Object} html The html for the rendered template
     */
    this.renderInvestment = function(investment) {
      var html;

      html = this.renderTemplate(this.attr.tmpltextInvestmentTr, investment);

      return html;
    };

    /**
     * Get the current data defined on the investment.
     *
     * @param {Object} investment Investment, schema: investment.
     * @return {Object} data The altered investment data.
     */
    this.getInvestmentData = function(investment) {
      var data = {},
          $investment;

      $investment = this.findInvestment(investment.symbol);
      $investment.find(this.attr.selectorEntryField).each(function() {
        var key = $(this).attr('name'),
            val = $(this).data(key);

            data[key] = val;
      });

      return data;
    };

    /**
     * Update a single investment's data in the DOM.
     *
     * @param {Object} investment Investment, schema: investment.
     */
    this.updateInvestment = function(investment) {
      var $investment,
          newData = {},
          html;

      $investment = this.findInvestment(investment.symbol);
      html = this.renderInvestment(investment);

      $investment.replaceWith(html);
    };
    
    /**
     * Update multiple investments data in the DOM.
     *
     * @param {Array} investments Array of investment(s).
     */
    this.updateInvestments = function(investments) {
      var i,
          ilen,
          investment;

      for (i = 0, ilen = investments.length; i < ilen; i++) {
        investment = investments[i];
        if (!investment.fields) {
          continue;
        }
        investment = this.updateInvestment(investment);
      }
    };

    /**
     * Delete an investment from the list DOM
     *
     * @param {Object} symbol The symbol data object.
     */
    this.deleteInvestment = function(symbol) {
      var $symbol;

      $symbol = this.findInvestment(symbol);
      if ($symbol.length) {
        $symbol.remove();
        this.trigger('ui-deleted_investment', symbol);
      }
    };

    /**
     * Deletes a group from the DOM and moves its associated investments to
     * the no group zone at the top.
     *
     * @param {Object} group The group to delete, !schema group.json
     */
    this.deleteGroup = function(group) {
      var $row,
          $groupToDelete,
          investmentsSave = [],
          i;

      $groupToDelete = this.findGroup(group.name);
      // This is kinda cool but is there a way to select this?
      for ($row = $groupToDelete.next('tr'); 
           $row.length && $row.hasClass(this.attr.selectorEntry);
           $row = $row.next('tr')) {
        $row.detach();
        investmentsSave.push($row);
      }
      $groupToDelete.remove();

      $.each(investmentsSave, function($investment) {
        this.select('selectorList').prepend($investment);
      });
    };
  }
});
