'use strict';

describeComponent('component/ui-add_form', function () {
  var testString = 'testString';

  // Initialize the component and attach it to the DOM
  beforeEach(function () {
    var fixture = '<form>'+
                    '<input type="text" class="js-symbol"'+
                      'value='+ testString +' />'+
                  '</form>';
    setupComponent(fixture);
  });

  it('should be defined', function () {
    expect(this.component).toBeDefined();
  });

  describe('on submit', function() {
    it('should listen for input submit events and trigger ui-add_symbol',
       function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'ui-add_symbol');

      this.$node.trigger('submit');

      expect(eventSpy.mostRecentCall.data).toEqual({symbol: testString});
    });
    it('should listen for input submit events and trigger event on document',
       function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'ui-add_symbol');

      this.$node.trigger('submit');

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
  });

  describe('on click .addGroup', function() {
    it('should trigger a ui-add_group event on document', function() {
      var eventSpy,
          selector = this.component.attr.selectorAddGroup;

      eventSpy = spyOnEvent(this.$node, 'ui-add_group');

      this.$node.trigger('click', selector);

      expect(eventSpy).toHaveBeenTriggeredOn(this.$node);
    });
  });

  describe('data-load_groups', function() {
    it('should not affect the groups select dom if empty object is passed',
       function() {
      var actual,
          expected = '';

      this.$node.select(this.component.attr.selectorGroups).html(expected);

      this.component.trigger('data-load_groups', {});

      actual = this.$node.select(this.component.attr.selectorGroups).html();

      expect(actual).toEqual(expected);
    });
    it('should not affect the groups select dom if no group list passed in',
       function() {
      var actual,
          expected = '';

      this.$node.select(this.component.attr.selectorGroups).html(expected);

      this.component.trigger('data-load_groups', {group: null});

      actual = this.$node.select(this.component.attr.selectorGroups).html();

      expect(actual).toEqual(expected);
    });
    it('should add one <option> to the group select dom if one group is passed',
       function() {
      var actual,
          testGroup = {id: 1, name: 'test'},
          template = Hogan.compile(this.component.attr.tmpltextGroupSelectOption),
          expected = template.render(testGroup);

      this.$node.select(this.component.attr.selectorGroups).html('');

      this.component.trigger('data-load_groups', {groups: [testGroup]});

      actual = this.$node.select(this.component.attr.selectorGroups).html();

      expect(actual).toEqual(expected);
    });
    it('should add multiple <option>(s) to the group select dom for multiple ' +
       'groups', function() {
      var actual,
          testGroups = [{id: 1, name: 'test1'}, {id: 2, name: 'test2'}],
          template = Hogan.compile(this.component.attr.tmpltextGroupSelectOption),
          expected;

      this.$node.select(this.component.attr.selectorGroups).html('');

      expected = template.render(testGroups[0]);
      expected += template.render(testGroups[1]);
      
      this.component.trigger('data-load_groups', {groups: testGroups});

      actual = this.$node.select(this.component.attr.selectorGroups).html();

      expect(actual).toEqual(expected);
    });
    it('should not duplicate <option> elements when called more then 1 time',
       function() {
      var actual,
          testGroups = [{id: 1, name: 'test1'}, {id: 2, name: 'test2'}],
          template = Hogan.compile(this.component.attr.tmpltextGroupSelectOption),
          expected;

      this.$node.select(this.component.attr.selectorGroups).html('');

      expected = template.render(testGroups[0]);
      expected += template.render(testGroups[1]);
      
      this.component.trigger('data-load_groups', {groups: testGroups});
      this.component.trigger('data-load_groups', {groups: testGroups});

      actual = this.$node.select(this.component.attr.selectorGroups).html();

      expect(actual).toEqual(expected);
    });
  });
});
