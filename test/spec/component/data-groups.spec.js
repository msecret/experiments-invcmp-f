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
});
