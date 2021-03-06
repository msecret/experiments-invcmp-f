'use strict';

describeComponent('component/data-investments', function () {
  var testInvestmentRequest,
      testInvestment,
      testYqlResponse;

  var API_PREFIX = '/api/v0';

  // Initialize the component and attach it to the DOM
  beforeEach(function () {
    setupComponent();
    testInvestmentRequest = {
      id: 1,
      symbol: 'TST',
      group: {name: 'TGroup'}
    };
    testInvestment = {
      id: 1,
      symbol: 'TST',
      group: {name: 'TGroup'},
      fields: {
        symbol: {val: 'TST'}
      }
    };
    testYqlResponse = {
      query: {
        results: {
          symbol: 'TST',
          Volume: '14881982'
        }
      }
    };
  });

  it('should be defined', function () {
    expect(this.component).toBeDefined();
  });

  describe('on initialize', function() {
    var server,
        testInvestmentsResp = {};

    beforeEach(function() {
      server = sinon.fakeServer.create();
      testInvestmentsResp = {
        data: {
          investments: testInvestment
        }
      }
    });

    afterEach(function() {
      server.restore();
    });

    it('should make a GET request to the server at the GetMultiple url',
        function() {
      server.respondWith('GET', this.component.attr.urlGetMultiple,
                              [200, { 'Content-Type': 'application/json' },
                              JSON.stringify(testInvestmentsResp)]);

      setupComponent();
      server.respond();

      expect(server.requests[0].url).toEqual(API_PREFIX + '/investments');
      expect(server.requests[0].method).toEqual('GET');
    });
    it('should trigger data-init_investments with data from server', function() {
      var eventSpy;

      server.respondWith('GET', this.component.attr.urlGetMultiple,
                              [200, { 'Content-Type': 'application/json' },
                              JSON.stringify(testInvestmentsResp)]);

      eventSpy = spyOnEvent(document, 'data-init_investments');

      setupComponent();
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });

  });

  describe('on ui-add_investment', function() {
    var server,
        clock;

    beforeEach(function() {
      server = sinon.fakeServer.create();
      clock = sinon.useFakeTimers(0);
    });

    afterEach(function() {
      server.restore();
      clock.restore();
    });

    it('should trigger data-invalid_investment if data is not truthy',
       function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_investment');
      this.$node.trigger('ui-add_investment', null);

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('shoud not trigger anything if there is no symbol in data', function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_investment');
      this.$node.trigger('ui-add_investment', {investment: {}});

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should not make an ajax request if symbol is not a string', function() {
      this.$node.trigger('ui-add_symbol', {investment: {symbol: []}});

      expect(server.requests.length).toEqual(0);
    });
    it('should trigger data-invalid_investment if symbol is not a string',
       function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_investment');
      this.$node.trigger('ui-add_investment', {investment: {symbol: 1}});

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should make a request to get the data from yql', function() {
      this.$node.trigger('ui-add_investment', {investment: {symbol: 'YHOO'}});
    });
    it('should trigger data-invalid_investment if symbol not found in yql',
       function() {
      var eventSpy,
          yqlQueryUrl;

      eventSpy = spyOnEvent(document, 'data-invalid_investment');

      yqlQueryUrl = 'https://query.yahooapis.com/v1/public/yql?' +
        'format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys' +
        '&q=SELECT+*+FROM+yahoo.finance.keystats+WHERE+symbol%3DMNS'

      server.respondWith('GET', yqlQueryUrl,
                              [404, { 'Content-Type': 'application/json' },
                              '{status: "Not found", code: 404}']);

      this.$node.trigger('ui-add_investment', {investment: {symbol: 'MNS'}});

      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
     });
    it('should make a POST ajax call to /investments if symbol found',
        function() {
      var yqlQueryUrl;

      yqlQueryUrl = 'https://query.yahooapis.com/v1/public/yql' +
        '?format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys' +
        '&q=SELECT+*+FROM+yahoo.finance.keystats+WHERE+symbol%3D\'TST\'';

      server.respondWith('GET', yqlQueryUrl,
                              [200, { 'Content-Type': 'application/json' },
                              JSON.stringify(testYqlResponse)]);

      this.$node.trigger('ui-add_investment', {investment:
                                               testInvestmentRequest});

      server.respond();

      expect(server.requests[1].url).toEqual(API_PREFIX + '/investments');
      expect(server.requests[1].method).toEqual('POST');
    });
    it('should trigger data-added_investment with investment data if the request'+
       ' succeeded', function() {
      var testInvestmentRequest,
          testYqlResponse,
          expected,
          yqlQueryUrl,
          eventSpy;

      testInvestmentRequest = {
        symbol: 'TNT',
        group: {name: 'TGroup1'}
      };
      testYqlResponse = {
        query: {
          results: {
            stock: {
              symbol: 'TNT',
              volume: 101241
            }
          }
        }
      };
      expected = {
        symbol: 'TNT',
        group: {name: 'TGroup1'},
        fields: {
          symbol: {val: 'TNT'},
          volume: {val: 101242}
        }

      };

      yqlQueryUrl = 'https://query.yahooapis.com/v1/public/yql' +
        '?format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys' +
        '&q=SELECT+*+FROM+yahoo.finance.keystats+WHERE+symbol%3D\'TNT\'';

      eventSpy = spyOnEvent(document, 'data-added_investment');

      server.respondWith('GET', yqlQueryUrl,
                              [200, { 'Content-Type': 'application/json' },
                              JSON.stringify(testYqlResponse)]);
      server.respondWith('POST', API_PREFIX + '/investments',
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify({data: {investment: expected}})]);

      this.$node.trigger('ui-add_investment',
                        {investment: testInvestmentRequest});
      server.respond();
      server.respond();

      expect(eventSpy.mostRecentCall.data.investment.symbol).toEqual(
        expected.symbol);
    });
    it('should leave group null if no group is present in data', function() {
      var testInvestmentRequest,
          expected,
          yqlQueryUrl,
          testYqlResponse,
          eventSpy;

      testInvestmentRequest = {
        symbol: 'TNT'
      };
      testYqlResponse = {
        query: {
          results: {
            stock: {
              symbol: 'TNT',
              volume: 101241
            }
          }
        }
      };
      expected = {
        symbol: 'TNT',
        fields: {
          symbol: {val: 'TNT'}
        }
      };

      eventSpy = spyOnEvent(document, 'data-added_investment');

      yqlQueryUrl = 'https://query.yahooapis.com/v1/public/yql' +
        '?format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys' +
        '&q=SELECT+*+FROM+yahoo.finance.keystats+WHERE+symbol%3D\'TNT\'';

      server.respondWith('GET', yqlQueryUrl,
                              [200, { 'Content-Type': 'application/json' },
                              JSON.stringify(testYqlResponse)]);
      server.respondWith('POST', API_PREFIX + '/investments',
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify({data: {investment: expected}})]);

      this.$node.trigger('ui-add_investment',
                        {investment: testInvestmentRequest});
      server.respond();
      server.respond();

      expect(eventSpy.mostRecentCall.data.investment.symbol).toEqual(
        expected.symbol);
    });
    it('should fire data-invalid_investment with status code when server returns'+
       '404 failures', function() {
      var eventSpy,
          expected;

      expected = {
        statusCode: 404,
        message: 'not found'
      };
      eventSpy = spyOnEvent(document, 'data-invalid_investment');
      server.respondWith('POST', API_PREFIX + '/investments',
                              [404, { 'Content-Type': 'application/json' },
                               JSON.stringify(expected)]);

      this.$node.trigger('ui-add_investment',
                         {investment: testInvestmentRequest});
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should fire data-failed_request when server returns failure over 500',
       function() {
      var eventSpy,
          yqlQueryUrl,
          testYqlResponse,
          expected;

      expected = {
        statusCode: 500,
        message: 'not found'
      };
      testYqlResponse = {
        query: {
          results: {
            stock: {
              symbol: 'TST',
              volume: 101241
            }
          }
        }
      };
      eventSpy = spyOnEvent(document, 'data-failed_request');

      yqlQueryUrl = 'https://query.yahooapis.com/v1/public/yql' +
        '?format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys' +
        '&q=SELECT+*+FROM+yahoo.finance.keystats+WHERE+symbol%3D\'TST\'';

      server.respondWith('GET', yqlQueryUrl,
                              [200, { 'Content-Type': 'application/json' },
                              JSON.stringify(testYqlResponse)]);
      server.respondWith('POST', API_PREFIX + '/investments',
                              [500, { 'Content-Type': 'application/json' },
                               JSON.stringify(expected)]);

      this.$node.trigger('ui-add_investment',
                         {investment: testInvestmentRequest});
      server.respond();
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should update the updatedAt timestamp on on fields', function() {
      var testInvestmentRequest,
          testInvestment,
          yqlQueryUrl,
          testYqlResponse,
          expected,
          eventSpy,
          actual;

      testInvestmentRequest = {
        symbol: 'MNT'
      };
      testYqlResponse = {
        query: {
          results: {
            stock: {
              symbol: 'MNT',
              volume: 101241
            }
          }
        }
      };
      clock.tick(50);
      expected = new Date();
      testInvestment = {
        symbol: 'MNT',
        fields: {
          symbol: {val: 'MNT'},
          cap: {val: 100}
        }
      };

      eventSpy = spyOnEvent(document, 'data-added_investment');

      yqlQueryUrl = 'https://query.yahooapis.com/v1/public/yql' +
        '?format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys' +
        '&q=SELECT+*+FROM+yahoo.finance.keystats+WHERE+symbol%3D\'MNT\'';

      server.respondWith('GET', yqlQueryUrl,
                              [200, { 'Content-Type': 'application/json' },
                              JSON.stringify(testYqlResponse)]);
      server.respondWith('POST', API_PREFIX + '/investments',
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify(
                                 {data: {investment: testInvestment}})]);

      this.$node.trigger('ui-add_investment',
                        {investment: testInvestmentRequest});
      server.respond();
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
      actual = eventSpy.mostRecentCall.data.investment;
      expect(actual.fields.cap.updatedAt).toEqual(expected);
    });
    it('should update the updatedAtFormatted timestamp on on fields', function() {
      var testInvestmentRequest,
          testInvestment,
          yqlQueryUrl,
          testYqlResponse,
          expected,
          eventSpy,
          newDate,
          actual;

      testInvestmentRequest = {
        symbol: 'MNT'
      };
      testYqlResponse = {
        query: {
          results: {
            stock: {
              symbol: 'MNT',
              volume: 101241
            }
          }
        }
      };
      clock.tick(50);
      newDate = new Date();
      expected =
        newDate.getMonth() + '/' +
        newDate.getDate() + '/' +
        newDate.getFullYear();
      testInvestment = {
        symbol: 'MNT',
        fields: {
          symbol: {val: 'MNT'},
          cap: {val: 100}
        }
      };

      eventSpy = spyOnEvent(document, 'data-added_investment');

      yqlQueryUrl = 'https://query.yahooapis.com/v1/public/yql' +
        '?format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys' +
        '&q=SELECT+*+FROM+yahoo.finance.keystats+WHERE+symbol%3D\'MNT\'';

      server.respondWith('GET', yqlQueryUrl,
                              [200, { 'Content-Type': 'application/json' },
                              JSON.stringify(testYqlResponse)]);
      server.respondWith('POST', API_PREFIX + '/investments',
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify(
                                      {data: {investment: testInvestment}})]);

      this.$node.trigger('ui-add_investment',
                        {investment: testInvestmentRequest});
      server.respond();
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
      actual = eventSpy.mostRecentCall.data.investment;

      expect(actual.fields.cap.updatedAtFormatted).toEqual(expected);
    });
  });

  describe('on ui-get_investment', function() {
    var server,
        clock;

    beforeEach(function() {
      server = sinon.fakeServer.create();
      clock = sinon.useFakeTimers(0);
    });

    afterEach(function() {
      server.restore();
      clock.restore();
    });

    it('should not trigger an event if investment or investment.symbol missing',
       function() {
      var eventSpy,
          badInvestment;

      badInvestment = {
        group: {name: 'OK'}
      };
      this.$node.trigger('ui-get_investment',
                         {investment: badInvestment});

      eventSpy = spyOnEvent(document, 'data-added_investment');

      expect(eventSpy).not.toHaveBeenTriggeredOn(document);
    });
    it('should trigger a data-got_investment with investment data on document',
        function() {
      var testInvestmentRequest,
          expected,
          eventSpy;

      testInvestmentRequest = {
        id: 5,
        symbol: 'TNZ',
        group: {name: 'TGroup1'}
      };
      expected = {
        symbol: 'TNZ',
        group: {name: 'TGroup1'},
        fields: {
          symbol: {val: 'TNZ'}
        }
      };

      eventSpy = spyOnEvent(document, 'data-got_investment');
      server.respondWith('GET', API_PREFIX + '/investment/'+
                                testInvestmentRequest.id,
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify({investment: expected})]);

      this.$node.trigger('ui-get_investment',
                        {investment: testInvestmentRequest});
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
      expect(eventSpy.mostRecentCall.data.investment.symbol).toEqual(
        expected.symbol);
    });
  });

  describe('on ui-update_investment', function() {
    var server,
        clock;

    beforeEach(function() {
      server = sinon.fakeServer.create();
      clock = sinon.useFakeTimers(0);
    });

    afterEach(function() {
      server.restore();
      clock.restore();
    });

    it('should not trigger an event if missing data',
       function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_investment');
      this.$node.trigger('ui-update_investment', {investment: {}});

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('shoud not trigger anything if there is no symbol in data', function() {
      var eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_investment');
      this.$node.trigger('ui-update_investment', {investment: {group: {}}});

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should make a PUT ajax call to /investment/{id} if symbol string',
       function() {
      this.$node.trigger('ui-update_investment', {investment:
                                                   testInvestment});

      expect(server.requests[0].url).toEqual(
        API_PREFIX + '/investment/'+ testInvestment.id);
      expect(server.requests[0].method).toEqual('PUT');
    });
    it('should trigger data-updated_investment if the request succeeds',
       function() {
      var expected,
          eventSpy;

      expected = {
        id: 4,
        symbol: 'TNT',
        group: {name: 'TGroup1'},
        fields: {
          symbol: {val: 'TNT'}
        }

      };
      eventSpy = spyOnEvent(document, 'data-updated_investment');
      server.respondWith('PUT', API_PREFIX + '/investment/'+ expected.id,
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify({data: {investment: expected}})]);

      this.$node.trigger('ui-update_investment',
                        {investment: expected});
      server.respond();

      expect(eventSpy.mostRecentCall.data.investment.symbol).toEqual(
        expected.symbol);
    });
    it('should update the updatedAt timestamp on on fields', function() {
      var testInvestment,
          expected,
          eventSpy,
          actual;

      clock.tick(50);
      expected = new Date();
      testInvestment = {
        id: 3,
        symbol: 'MNT',
        fields: {
          symbol: {val: 'MNT'},
          cap: {val: 100}
        }
      };

      eventSpy = spyOnEvent(document, 'data-updated_investment');
      server.respondWith('PUT', API_PREFIX + '/investment/'+ testInvestment.id,
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify(
                                 {data: {investment: testInvestment}})]);

      this.$node.trigger('ui-update_investment',
                        {investment: testInvestment});
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
      actual = eventSpy.mostRecentCall.data.investment;
      expect(actual.fields.cap.updatedAt).toEqual(expected);
    });
    it('should update the updatedAtFormatted timestamp on on fields', function() {
      var testInvestment,
          expected,
          eventSpy,
          newDate,
          actual;

      clock.tick(50);
      newDate = new Date();
      expected =
        newDate.getMonth() + '/' +
        newDate.getDate() + '/' +
        newDate.getFullYear();
      testInvestment = {
        id: 3,
        symbol: 'MNT',
        fields: {
          symbol: {val: 'MNT'},
          cap: {val: 100}
        }
      };

      eventSpy = spyOnEvent(document, 'data-updated_investment');
      server.respondWith('PUT', API_PREFIX + '/investment/' + testInvestment.id,
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify(
                                 {data: {investment: testInvestment}})]);

      this.$node.trigger('ui-update_investment',
                        {investment: testInvestment});
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
      actual = eventSpy.mostRecentCall.data.investment;

      expect(actual.fields.cap.updatedAtFormatted).toEqual(expected);
    });
  });

  describe('on ui-delete_investment', function() {
    var server;

    beforeEach(function() {
      server = sinon.fakeServer.create();
    });

    afterEach(function() {
      server.restore();
    });

    it('should request a DELETE on /investment/{id}', function() {
      var expected = {symbol: 'SYN'};

      this.$node.trigger('ui-delete_investment',
                         {investment: testInvestmentRequest});

      expect(server.requests[0]).toBeDefined();
      expect(server.requests[0].url).toEqual(
        API_PREFIX + '/investment/'+ testInvestmentRequest.id);
      expect(server.requests[0].method).toEqual('DELETE');
    });
    it('should trigger a data-deleted_symbol on document with the investment',
       function() {
        var eventSpy,
            expected;

      expected = {
        id: 2,
        symbol: 'TMT',
        group: {name: 'TGroup3'}
      };

      eventSpy = spyOnEvent(document, 'data-deleted_investment');
      server.respondWith('DELETE', API_PREFIX + '/investment/'+ expected.id,
                              [200, { 'Content-Type': 'application/json' },
                               JSON.stringify(expected)]);

      this.$node.trigger('ui-delete_investment', {investment: expected});
      server.respond();

      expect(eventSpy.mostRecentCall.data).toEqual({investment: expected});
    });
    it('should trigger a data-invalid_investment if the id is missing',
       function() {
      var testInvestment = {symbol: 'NDS', group: 'Groupa'},
          eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_investment');

      this.$node.trigger('ui-delete_investment', {investment: testInvestment});

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should trigger a data-invalid_investment if the symbol is not a string',
       function() {
      var testInvestment = {group: 'Groupa', symbol: 1},
          eventSpy;

      eventSpy = spyOnEvent(document, 'data-invalid_investment');

      this.$node.trigger('ui-delete_investment', testInvestment);

      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
    it('should trigger a data-invalid_investment reason:not found if the server'+
       'returns 404', function() {
      var eventSpy,
          expected;

      expected = {
        investment: testInvestmentRequest,
        status: 404,
        statusCode: 404,
        message: 'Not Found'
      };
      eventSpy = spyOnEvent(document, 'data-invalid_investment');
      server.respondWith('DELETE', API_PREFIX + '/investment/'+
                                testInvestmentRequest.id,
                              [404, { 'Content-Type': 'application/json' },
                               JSON.stringify(expected)]);

      this.$node.trigger('ui-delete_investment',
                         {investment: testInvestmentRequest});
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
      expect(eventSpy.mostRecentCall.data).toEqual(expected);
    });
    it('should trigger a data-failed_request if server returns 500', function() {
      var eventSpy,
          expected;

      expected = {
        data: {
          investment: testInvestmentRequest,
        },
        status: 500,
        statusCode: 500,
        message: 'Internal Server Error'
      };
      eventSpy = spyOnEvent(document, 'data-failed_request');
      server.respondWith('DELETE', API_PREFIX + '/investment/'+
                                testInvestmentRequest.id,
                              [500, { 'Content-Type': 'application/json' },
                               JSON.stringify(expected)]);

      this.$node.trigger('ui-delete_investment',
                         {investment: testInvestmentRequest});
      server.respond();

      expect(eventSpy).toHaveBeenTriggeredOn(document);
      expect(eventSpy.mostRecentCall.data).toEqual(expected);
    });
  });
});
