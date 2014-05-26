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
      this.on(document, 'data-deleted_investment', this.handleDeletedInvestment);
      this.on(this.attr.selectorEntryDelete, 'click', this.handleEntryDelete);

      // Have to attach to $node because flight on doesn't support non-present
      // handlers :(.
      this.$node.on('click', this.attr.selectorEntryDelete, function(ev) {
        self.handleEntryDelete(ev, self);
      });
      this.$node.on('click', this.attr.selectorEntryUpdate, function(ev) {
        self.handleEntryUpdate(ev, self);
      });
      this.$node.on('dblclick', this.attr.selectorEntryField, function(ev) {
        self.handleEntryFieldUpdate(ev, self);
      });

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

      if (data.investment && data.investment.symbol &&
          data.investment.fields) {
        investment = data.investment;

        if (investment.group) {
          this.addInvestmentToGroup(investment.fields, 
                                investment.group);
        }
        else {
          this.addInvestmentNoGroup(investment.fields);
        }

        this.trigger('ui-added_investment', data.investment);
      }
    };

    /**
     * Handle the delete button for an entry being clicked
     *
     * @param {Object} ev The jQuery event object
     * @param {Object} self The this defined in this class, currently a hack.
     */
    this.handleEntryDelete = function(ev, self) {
      ev.preventDefault();
      var $target = $(ev.currentTarget),
          symbol = $target.data('symbol');
      self.$node.trigger('ui-delete_investment', {investment: 
                          {symbol: symbol}});
    };

    /**
     * Handle the update button for an entry being clicked
     *
     * @param {Object} ev The jQuery event object
     * @param {Object} self The this defined in this class, currently a hack.
     */
    this.handleEntryUpdate = function(ev, self) {
      ev.preventDefault();
      var $target = $(ev.currentTarget),
          symbol = $target.data('symbol');
      self.$node.trigger('ui-update_investment', {investment: 
                          {symbol: symbol}});
    };

    /**
     * Handles when an entry's field is clicked to edit the field.
     *
     * @param {Object} ev The jQuery event object
     * @param {Object} self The this defined in this class, currently a hack.
     */
    this.handleEntryFieldUpdate = function(ev, self) {
      ev.preventDefault();
      var $target = $(ev.currentTarget),
          symbol = $target.parent().data('symbol'),
          fieldName = $target.attr('name');

      this.trigger('ui-edit_investment_field', {investment: {
        symbol: symbol,
        field: fieldName
      }});
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
      html = this.renderTemplate(this.attr.tmpltextInvestmentTr, investment);

      $groupSelector.after(html);
    };
    
    /**
     * Add the investment under no group.
     *
     * @param {Object} investment The investment object to add.
     */
    this.addInvestmentNoGroup = function(investment) {
      var html;

      html = this.renderTemplate(this.attr.tmpltextInvestmentTr, investment);

      this.select('selectorList').prepend(html);
    };

    /**
     * Delete a symbol from the list DOM
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

  }
});
