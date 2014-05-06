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
   * Module function
   */
  function addForm() {
    this.defaultAttrs({
      symbolInputSelector: '.js-symbol',
      selectorGroups: '.js-groups',
      tmpltextGroupSelectOption: tmpltextGroupSelectOption
    });

    this.after('initialize', function () {

      this.on('submit', this.handleSymbolAdd);
      this.on('data-load_groups', this.addGroupsToForm);
    });

    /**
     * Will take the input from the add form and submit it.
     *
     * {event} ui-add_symbol
     */
    this.handleSymbolAdd = function(ev) {
      ev.preventDefault();
      var symbol = this.select('symbolInputSelector').val();

      this.trigger('ui-add_symbol', {
        symbol: symbol
      });
    };

    /**
     * Takes a data attribute of multiple groups and adds each individually to
     * the group select.
     */
    this.addGroupsToForm = function(ev, data) {
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
        
        this.$node.select(this.attr.selectorGroups).html(groupsHtml);
      }
    };
  }

  /**
   * Module exports
   */
  return defineComponent(addForm, withHogan);

});
