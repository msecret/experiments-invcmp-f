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
      selectorAddGroup: '.js-addGroupButton',
      selectorGroups: '.js-groups',
      selectorActiveGroups: '.js-activeGroups',
      tmpltextGroupSelectOption: tmpltextGroupSelectOption
    });

    this.after('initialize', function () {

      this.on('submit', this.handleSymbolAdd);
      this.on(document, 'data-load_groups', this.handleLoadGroups);
      this.on(document, 'data-added_group', this.handleAddedGroup);
      this.on(document, 'data-deactivate_group_add', this.handleDeactivateGroup);
      this.on(this.attr.selectorGroups, 'change', this.handleSelectChange);
    });

    /**
     * Will take the input from the add form and submit it.
     *
     * @event ui-add_symbol
     */
    this.handleSymbolAdd = function(ev) {
      ev.preventDefault();
      var symbol = this.select('selectorSymbol').val(),
          group = this.select('selectorGroups').val();

      this.trigger('ui-add_symbol', {
        group: group || null,
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
    this.handleAddGroup = function() {
      this.trigger('ui-wanted_new_group');
    };

    /**
     * Handles when a new group is added.
     *
     * @param {Object} ev The jQuery event object.
     * @param {Object} data The data, should contain group name
     */
    this.handleAddedGroup = function(ev, data) {
      var group = data.group;

      if (group) {
        this.addGroup(data.group);  
        this.selectGroup(data.group);
      }
    };

    this.handleSelectChange = function(ev, data) {
      ev.preventDefault();
      var $selected = this.select('selectorGroups')
          .find('option:selected'),
          selector = this.attr.selectorAddGroup;

      if ($selected.hasClass(selector.substr(1))) {
        this.handleAddGroup();
      }
    };

    this.handleDeactivateGroup = function() {
      this.selectDefault(); 
    };

    /**
     * Remove all active group options from the node
     */
    this.clearGroups = function() {
      this.select('selectorActiveGroups').remove();
    };

    /**
     * Adds a single group to the form
     *
     * @param {String} group The new group name
     */
    this.addGroup = function(group) {
      var groupHtml;
       
      groupHtml = this.renderTemplate(this.attr.tmpltextGroupSelectOption,
                                      {name: group});

      this.select('selectorGroups').append(groupHtml);
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
        
        this.select('selectorGroups').append(groupsHtml);
      }
    };

    /**
     * Programatically selects the group. Makes no attempt to ensure group
     * option exists.
     *
     * @param {String} group The group name
     */
    this.selectGroup = function(group) {
      this.select('selectorGroups')
          .find('option[value="'+ group +'"]').prop('selected', true);
    };

    /**
     * Selects the first null option
     */
    this.selectDefault = function() {
      this.select('selectorGroups')
          .find('.js-addGroupNullOption').prop('selected', true);
    };
  }
});
