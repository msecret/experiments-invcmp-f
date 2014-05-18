define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */
  var addForm = require('component/ui-add_form');
  var addGroup = require('component/ui-add_group');
  var investments = require('component/ui-investments');
  var dataInvestments = require('component/data-investments');
  var dataGroups = require('component/data-groups');

  /**
   * Module exports
   */
  return initialize;

  /**
   * Module function
   */
  function initialize() {
    addForm.attachTo('.js-addInvestment');
    addGroup.attachTo('.js-addGroup');
    investments.attachTo('.js-investmentList');
    dataInvestments.attachTo(document);
    dataGroups.attachTo(document);
  }

});
