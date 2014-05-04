define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */
  var addForm = require('component/add-form');
  var symbolFinder = require('component/symbol-finder');

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
