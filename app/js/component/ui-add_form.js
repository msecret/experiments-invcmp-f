define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */
  var defineComponent = require('flight/lib/component');
  var withHogan = require('flight-hogan/lib/with_hogan');
  var tmpltextGroupSelectOption = require(
    'text!template/group_select_option.html');

  /**
   * Module exports
   */
  return defineComponent(addForm, withHogan);

  /**
   * Module function
   */
  function addForm() {
    this.defaultAttrs({
      selectorSymbol: '.js-symbol',
      selectorAddGroup: '.js-addGroup',
      selectorGroups: '.js-groups',
      selectorActiveGroups: '.js-activeGroups',
      tmpltextGroupSelectOption: tmpltextGroupSelectOption
    });

    this.after('initialize', function () {

      this.on('submit', this.handleSymbolAdd);
      this.on('click ' + this.attr.selectorAddGroup, this.handleAddGroup); // :(
      this.on('data-load_groups', this.handleLoadGroups);
    });

    /**
     * Will take the input from the add form and submit it.
     *
     * @event ui-add_symbol
     */
    this.handleSymbolAdd = function(ev) {
      ev.preventDefault();
      var symbol = this.select('selectorSymbol').val();

      this.trigger('ui-add_symbol', {
        symbol: symbol
      });
    };

    /**
     * Handler for when all groups are loaded.
     *
     * Will clear groups and then add the ones passed in data.
     */
    this.handleLoadGroups = function(ev, data) {
      this.clearGroups();
      this.addGroups(data);
    };

    /**
     * Handler for when add group button is clicked
     */
    this.handleAddGroup = function(ev) {
      ev.preventDefault();
      this.trigger('ui-add_group');
    };

    /**
     * Remove all active group options from the node
     */
    this.clearGroups = function() {
      this.$node.select('selectorActiveGroups').remove();
    };

    /**
     * Takes a data attribute of multiple groups and adds each individually to
     * the group select.
     *
     * When using, should call clearGroups first to ensure there are no dupes.
     */
    this.addGroups = function(data) {
      var groupsHtml = '',
          groupHtml = '',
          dataGroups = data.groups,
          i,
          ilen;

      if (dataGroups) {
        for (i = 0, ilen = dataGroups.length; i < ilen; i++) {
          groupHtml = this.renderTemplate(this.attr.tmpltextGroupSelectOption,
                                           dataGroups[i]);
          groupsHtml += groupHtml;
        }
        
        this.$node.select('selectorGroups').append(groupsHtml);
      }
    };
  }
});
