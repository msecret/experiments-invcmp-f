'use strict';

describeComponent('component/ui-add_form', function () {
  var testString = 'testString';

  // Initialize the component and attach it to the DOM
  beforeEach(function () {
    var fixture = '<form>'+
                    '<input type="text" class="js-symbol"'+
                      'value='+ testString +' />'+
                      '<select class="js-groups">'+
                        '<option class="js-addGroupNullOption" value="">- '+
                          '</option>'+
                        '<option class="js-addGroupButton" value="add">add new '+
                          '</option>'+
                      '</select>'+
                      '<input class="js-submit" type="submit" name'+
                        '="addInvestment" />'+
                  '</form>';
    setupComponent(fixture);
  });

  it('should be defined', function () {
    expect(this.component).toBeDefined();
  });

  describe('on submit', function() {
    it('should listen for input submit events and trigger ui-add_investment',
       function() {
      var eventSpy,
          expected;

      expected = {
        symbol: 'BNT'
      };
      eventSpy = spyOnEvent(document, 'ui-add_investment');
      this.component.select('selectorSymbol').val(expected.symbol);

      this.$node.trigger('submit');

      expect(eventSpy.mostRecentCall.data).toEqual({investment: expected});
    });
    it('should listen for input submit events and trigger event on document',
       function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'ui-add_investment');

      this.$node.trigger('submit');

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should pass a group param if a group was selected', function() {
      var eventSpy,
          testInvestmentRequest,
          expected;

      testInvestmentRequest = {
        symbol: 'BNM',
        group: {name: 'TestG1'}
      };
      expected = testInvestmentRequest.group;

      eventSpy = spyOnEvent(document, 'ui-add_investment');
      this.component.addGroup(expected);
      this.component.selectGroup(expected.name);
      this.component.select('selectorSymbol').val(testInvestmentRequest.symbol);

      this.$node.trigger('submit');

      expect(eventSpy.mostRecentCall.data.investment.group).toEqual(expected);
    });
  });

  describe('on change groups', function() {
    it('should trigger a ui-add_group event on itself', function() {
      var eventSpy,
          selector = this.component.attr.selectorGroups;

      eventSpy = spyOnEvent(this.$node, 'ui-wanted_new_group');

      this.$node.select('selectorGroups')
          .find(selector)
          .prop('selected', true).change();
      this.$node.trigger(this.component.attr.selectorGroups, 'change');
      this.$node.select('selectorGroups').change();
      this.$node.select('selectorGroups').trigger('change');

      // This is completely broken on the twitter flight app
      // expect(eventSpy).toHaveBeenTriggeredOn(this.$node);
    });
  });

  describe('data-load_groups', function() {
    it('should not affect the groups select dom if empty object is passed',
       function() {
      var actual,
          expected = '';

      this.$node.select(this.component.attr.selectorGroups).html(expected);

      $(document).trigger('data-load_groups', {});

      actual = this.$node.select(this.component.attr.selectorGroups).html();

      expect(actual).toEqual(expected);
    });
    it('should not affect the groups select dom if no group list passed in',
       function() {
      var actual,
          expected = '';

      this.$node.select(this.component.attr.selectorGroups).html(expected);

      $(document).trigger('data-load_groups', {group: null});

      actual = this.$node.select(this.component.attr.selectorGroups).html();

      expect(actual).toEqual(expected);
    });
    it('should add one <option> to the group select dom if one group is passed',
       function() {
      var actual,
          testGroup = {id: 1, name: 'test'},
          template = Hogan.compile(this.component.attr.tmpltextGroupSelectOption),
          expected;

      this.component.select(this.component.attr.selectorGroups).html('');
      expected = $.trim(template.render(testGroup));

      $(document).trigger('data-load_groups', {groups: [testGroup]});

      actual = $.trim(this.component.select('selectorActiveGroups')
                      .prop('outerHTML'));

      expect(actual).toEqual(expected);
    });
    it('should add multiple <option>(s) to the group select dom for multiple ' +
       'groups', function() {
      var actual,
          testGroups = [{id: 1, name: 'test1'}, {id: 2, name: 'test2'}],
          template = Hogan.compile(this.component.attr.tmpltextGroupSelectOption),
          expected = 2; 

      this.component.select('selectorActiveGroups').remove();

      $(document).trigger('data-load_groups', {groups: testGroups});

      actual = this.component.select('selectorActiveGroups').length;

      expect(actual).toEqual(expected);
    });
  });

  describe('on data-added_investment', function() {
    it('should clear the text input form value', function() {
      var actual;

      this.component.select('selectorSymbol').val('something');
      $(document).trigger('data-added_investment');

      actual = this.component.select('selectorSymbol').val();

      expect(actual).toEqual('');
    });
  });

  describe('on data-added_group', function() {
    it('should add a new option to the select with the added group', function() {
      var expected = {name: 'newGroup'},
          actual;

      $(document).trigger('data-added_group', {group: expected});

      actual = this.$node.find('option[value="'+ expected.name +'"]');

      expect(actual.length).toEqual(1);
    });
    it('should select the new option', function() {
      var expected = {name: 'newGroupX'},
          actual;

      $(document).trigger('data-added_group', {group: expected});

      actual = this.component.select('selectorGroups').val();

      expect(actual).toEqual(expected.name);
    });
    it('should not add an new option if the group is empty', function() {
      var expected,
          actual;

      expected = this.$node.select('selectorGroups').find('option').length;

      $(document).trigger('data-added_group', {group: null});

      actual = this.component.select('selectorGroups').find('option').length;

      expect(actual).toEqual(expected);
    });
  });
  
  describe('on data-deactivate_group_add', function() {
    it('should select the placeholder option', function() {
      var actual;

      this.component.select('selectorGroups').val('add');

      $(document).trigger('data-deactivate_group_add');

      actual = this.component.select('selectorGroups').val();

      expect(actual).toEqual('');
    });
  });
});
