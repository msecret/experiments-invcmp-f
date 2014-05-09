define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */
  var addForm = require('component/ui-add_form');
  var addGroup = require('component/ui-add_group');
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
    addGroup.attachTo('js-addGroup');
    dataInvestments.attachTo(document);
  }

});
