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
      selectorEntryDelete: '.js-investmentListEntryControls-Delete', 
      selectorEntryUpdate: '.js-investmentListEntryControls-Update', 
      numCols: 18,
      tmpltextGroupTr: tmpltextGroupTr,
      tmpltextSymbolTr: tmpltextSymbolTr
    });

    this.after('initialize', function () {
      var self = this;

      this.on(document, 'data-added_group', this.handleAddedGroup);
      this.on(document, 'data-added_symbol', this.handleAddedSymbol);
      this.on(document, 'data-deleted_symbol', this.handleDeletedSymbol);
      this.on(this.attr.selectorEntryDelete, 'click', this.handleEntryDelete);

      // Have to attach to $node because flight on doesn't support non-present
      // handlers :(.
      this.$node.on('click', this.attr.selectorEntryDelete, function(ev) {
        self.handleEntryDelete(ev, self);
      });
      this.$node.on('click', this.attr.selectorEntryUpdate, function(ev) {
        self.handleEntryUpdate(ev, self);
      });

      this.addSymbolNoGroup({symbol: 'SYN'});
    });

    /**
     * Helper method to find a symbol in the current list DOM
     *
     * @param {String} sym The string of the symbol to find
     */
    this.findSymbol = function(sym) {
      return this.select('selectorList').find('tr[data-symbol="'+ sym +'"]');
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
    this.handleAddedSymbol = function(ev, data) {
      var symbol;
      if (data.symbol && data.symbol.symbol) {
        symbol = data.symbol;

        if (symbol.group) {
          this.addSymbolToGroup(symbol, symbol.group);
        }
        else {
          this.addSymbolNoGroup(symbol);
        }

        this.trigger('ui-added_symbol', data);
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
      self.$node.trigger('ui-delete_symbol', {symbol: symbol});
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
      self.$node.trigger('ui-update_symbol', {symbol: symbol});
    };
    /**
     * Handle a symbol deleted in data.
     *
     * @param {Object} ev The jQuery event object
     * @param {Object} data The data passed, should contain symbol deleted.
     */
    this.handleDeletedSymbol = function(ev, data) {
      if (!data.symbol || !data.symbol.symbol) {
        return;
      }

      this.deleteSymbol(data.symbol);
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
     * @param {Object} symbol The symbol object to add.
     * @param {Object} group The group object.
     */
    this.addSymbolToGroup = function(symbol, group) {
      var $groupSelector,
          html;

      $groupSelector = this.findGroup(group.name);
      html = this.renderTemplate(this.attr.tmpltextSymbolTr, symbol);

      $groupSelector.after(html);
    };
    
    /**
     * Add the symbol under no group.
     *
     * @param {Object} symbol The symbol object to add.
     */
    this.addSymbolNoGroup = function(symbol) {
      var html;

      
      html = this.renderTemplate(this.attr.tmpltextSymbolTr, symbol);

      this.select('selectorList').prepend(html);
    };

    this._addSymbol = function(symbol, $anchor) {
      var html;

      html = this.renderTemplate(this.attr.tmpltextSymbolTr, symbol);

      $anchor.after(html);
      if (!$anchor) {

      }
    };

    /**
     * Delete a symbol from the list DOM
     *
     * @param {Object} symbol The symbol data object.
     */
    this.deleteSymbol = function(symbol) {
      var $symbol;

      $symbol = this.findSymbol(symbol.symbol);
      if ($symbol.length) {
        $symbol.remove();
        this.trigger('ui-deleted_symbol', symbol);
      }
    };

  }
});
