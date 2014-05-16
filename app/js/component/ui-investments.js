define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */
  var defineComponent = require('flight/lib/component');
  var withHogan = require('flight-hogan/lib/with_hogan');
  var tmpltextGroupTr = require(
    'text!template/investment_list_group_tr.html');

  /**
   * Module exports
   */
  return defineComponent(uiInvestments, withHogan);

  /**
   * Module function
   */
  function uiInvestments() {
    this.defaultAttrs({
      selectorList: '.js-investmentList_Body',
      selectorGroups: '.js-investmentList_Group',
      numCols: 18,
      tmpltextGroupTr: tmpltextGroupTr
    });

    this.after('initialize', function () {
      this.on(document, 'data-added_group', this.handleAddedGroup);
    });

    /**
     * Handle data added group events. 
     */
    this.handleAddedGroup = function(ev, data) {
      this.addGroup(data.group);
      this.trigger('ui-added_group', data);
    };

    this.addGroup = function(group) {
      var context = {},
          html;

      $.extend(context, group, {numCols: this.attr.numCols});

      html = this.renderTemplate(this.attr.tmpltextGroupTr,
                                           context);

      this.select('selectorList').append(html);
    };
  }
});
