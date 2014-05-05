define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */
  var addForm = require('component/ui-add_form');
  var symbolFinder = require('component/data-symbol_finder');

  /**
   * Module exports
   */
  return initialize;

  /**
   * Module function
   */
  function initialize() {
    addForm.attachTo('.js-addInvestment');
    symbolFinder.attachTo('.js-addInvestment');
  }

});
