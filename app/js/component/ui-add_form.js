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
      symbolInputSelector: '.js-symbol'
    });

    this.after('initialize', function () {
      var html;

      if (this.data) {
        html = this.renderTemplate(tmpltextGroupSelectOption, {poop: 'noop'});
        this.$node.html(html);
      }

      this.on('submit', this.handleSubmit);
    });

    this.handleSubmit = function(ev) {
      ev.preventDefault();
      var symbol = this.select('symbolInputSelector').val();

      this.trigger('ui-add_symbol', {
        symbol: symbol
      });
    };
  }

  /**
   * Module exports
   */
  return defineComponent(addForm, withHogan);

});
