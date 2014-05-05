define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */
  var addForm = require('component/ui-add_form');
  var dataInvestments = require('component/data-investments');

  /**
   * Module exports
   */
  return initialize;

  /**
   * Module function
   */
  function initialize() {
    addForm.attachTo('.js-addInvestment');
    dataInvestments.attachTo(document);
  }

});
