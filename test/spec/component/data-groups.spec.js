'use strict';

describeComponent('component/data-groups', function () {
  var server;

  // Initialize the component and attach it to the DOM
  beforeEach(function () {
    setupComponent();
    server = sinon.fakeServer.create();
  });

  afterEach(function() {
    server.restore();
  });

  it('should be defined', function () {
    expect(this.component).toBeDefined();
  });

  describe('after initialize', function() {
    it('should call getGroups() to update the group form', function() {
    });
  });

  describe('on ui-add_group', function() {
    beforeEach(function() {
      this.component.groups = []; // Clear the components memory of groups.
    });
    it('should trigger data-invalid_add_group with reason: empty if group in '+
       'data is falsy', function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_add_group');

      this.component.trigger('ui-add_group', {group: ''});

      expect(eventSpy).toHaveBeenTriggeredOn(document);
      expect(eventSpy.mostRecentCall.data).toEqual({reason: 'empty'});
    });
    it('should trigger data-invalid_add_group with reason: duplicate if the '+
       'group is a duplicate', function() {
      var eventSpy,
          testGroup;

      eventSpy = spyOnEvent(document, 'data-invalid_add_group');
      testGroup = 'testGroup1';
      this.component.groups.push(testGroup);

      this.component.trigger('ui-add_group', {group: testGroup});

      expect(eventSpy).toHaveBeenTriggeredOn(document);
      expect(eventSpy.mostRecentCall.data).toEqual({reason: 'duplicate'});
    });
    it('should trigger data-loading_group', function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-loading_group');

      this.component.trigger('ui-add_group', {group: 'newGroup'});

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should trigger data-added_group if adding was successful', function() {
      var eventSpy,
          expected = 'newGroup';

      eventSpy = spyOnEvent(document, 'data-added_group');

      this.component.trigger('ui-add_group', {group: expected});

      expect(eventSpy).toHaveBeenTriggeredOn(document);
      expect(eventSpy.mostRecentCall.data).toEqual({group: expected});
    });
    it('should trigger data-loaded_group with new group on success', function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-loaded_group');

      this.component.trigger('ui-add_group', {group: 'newGroup'});

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
  });

  describe('getGroups()', function() {
    it('should default to no callbacks if options is not passed in', function() {
      server.respondWith('GET', '/groups',
                              [500, { 'Content-Type': 'application/json' },
                               '{}']);
      this.component.getGroups();
      server.respond();
    });
    it('should make an ajax request to /groups', function() {
      this.component.getGroups({});

      expect(server.requests[0].url).toEqual('/groups');
    });
    it('should execute the success callback passed in if request successful',
       function() {
      var cbSpy = sinon.spy(),
          expected = '[{"id": 1}]';

      server.respondWith('GET', '/groups',
                              [200, { 'Content-Type': 'application/json' },
                               expected]);

      this.component.getGroups({success: cbSpy});
      server.respond();

      expect(cbSpy).toHaveBeenCalledWith(JSON.parse(expected));
    });
    it('should execute the error callback passed in if request unsuccessful',
       function() {
      var cbSpy = sinon.spy();

      server.respondWith('GET', '/groups',
                              [500, { 'Content-Type': 'application/json' },
                               '']);

      this.component.getGroups({error: cbSpy});
      server.respond();

      expect(cbSpy).toHaveBeenCalled();
    });
  });

  describe('on ui-wanted_new_group', function() {
    it('should trigger a data-wanted_new_group event on document', function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-wanted_new_group');

      this.component.trigger('ui-wanted_new_group');

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
  });
});
