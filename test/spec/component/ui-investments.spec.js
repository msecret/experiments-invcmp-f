'use strict';

describeComponent('component/ui-investments', function () {
  var testInvestmentRequest,
      testInvestment;

  // Initialize the component and attach it to the DOM
  beforeEach(function () {
    var tableHtml = '<table class="js-investmentList">'+
      '<thead class="js-investmentList_Header">'+
        '<th class="js-investment_Control"></th>'+
        '<th data-name="symbol" name="symbol">Sym</th>'+
        '<th name="MarketCap">cap</th>'+
        '<th name="price">Price</th>'+
        '<th name="priceChangeYTD">Price change ytd</th>'+
        '<th name="trackingError">Tracking error</th>'+
        '<th name="TotalCash">assets</th>'+
        '<th name="AvgVol">volume</th>'+
        '<th name="bidAsk">Bid-ask</th>'+
        '<th name="msRisk">MS risk</th>'+
        '<th name="stdDev">Std dev</th>'+
        '<th name="beta">Beta</th>'+
        '<th name="alpha">Alpha</th>'+
        '<th name="rsquared">R^2</th>'+
        '<th name="sharpe">Sharpe</th>'+
        '<th name="index">Index</th>'+
        '<th name="market">Market</th>'+
        '<th name="creator">Creator</th>'+
      '</thead>'+
      '<tbody class="js-investmentList_Body">'+
      '</tbody>'+
    '</table>';

    setupComponent(tableHtml);
    testInvestmentRequest = { symbol: 'YST',
      group: {name: 'YGroup'}
    };
    testInvestment = {
      symbol: 'YST',
      group: {name: 'YGroup'},
      fields: {
        symbol: {val: 'YST'}
      }
    };
  });

  it('should be defined', function () {
    expect(this.component).toBeDefined();
  });

  describe('on data-init_investments', function() {
    it('should add the investments passed to the list', function() {
      var actual;

      actual = this.component.select('selectorList').find('tr').first();
      testInvestment.group = null;

      expect(actual.length).toEqual(0);

      $(document).trigger('data-init_investments',
                          {investments: [testInvestment]});

      actual = this.component.select('selectorList').find('tr').first();
      expect(actual.length).toEqual(1);
    });
    it('should add a group if there is one for the investment', function() {
      var actual;

      testInvestment.group = {'name': 'Tester3'};
      actual = this.component.findGroup(testInvestment.group.name);

      expect(actual.length).toEqual(0);

      $(document).trigger('data-init_investments',
                          {investments: [testInvestment]});

      actual = this.component.findGroup(testInvestment.group.name);
      expect(actual.length).toEqual(1);
    });
    it('should not add the same group twice', function() {
      var actual;

      testInvestment.group = {'name': 'Tester3'};
      actual = this.component.findGroup(testInvestment.group.name);

      expect(actual.length).toEqual(0);

      $(document).trigger('data-init_investments',
                          {investments: [testInvestment, testInvestment]});

      actual = this.component.findGroup(testInvestment.group.name);
      expect(actual.length).toEqual(1);
    });
  });

  describe('on data-added_investment', function() {
    it('should trigger a ui-added_investment event', function() {
      var expected,
          eventSpy;

      eventSpy = spyOnEvent(document, 'ui-added_investment');

      $(document).trigger('data-added_investment',
                          {investment: testInvestment});

      expect(eventSpy.mostRecentCall.data).toEqual(testInvestment);
    });
    it('should not trigger a ui-added_investment event if theres no symbol ' +
      'in data', function() {
      var expected,
          eventSpy;

      expected = {group: 'testGroup'};
      eventSpy = spyOnEvent(document, 'ui-added_investment');

      $(document).trigger('data-added_investment', {investment: expected});

      expect(!eventSpy.called);
    });
    it('should add the investment to the top of the list if no group specified',
       function() {
      var expected,
          actual,
          testInvestment,
          actualLen;

      testInvestment = {
        symbol: 'SYN',
        fields: {
          symbol: {val: 'SYN'}
        }
      };

      $(document).trigger('data-added_investment', {investment: testInvestment});

      actual = this.component.select('selectorList').find('tr').first();
      actualLen = actual.length;

      expect(actualLen).toEqual(1);
      expect(actual.data('symbol')).toEqual(testInvestment.symbol);
    });
    it('should add multiple invs to the top of the list if no group specified',
       function() {
      var expected,
          testInvestment1,
          actual,
          actualLen;

      testInvestment1 = {
        symbol: 'SYO',
        fields: {
          symbol: {val: 'SYO'}
        }
      };
      expected = {
        symbol: 'SYR',
        fields: {
          symbol: {val: 'SYR'}
        }
      };

      $(document).trigger('data-added_investment', {investment: testInvestment1});
      $(document).trigger('data-added_investment', {investment: expected});

      actual = this.component.select('selectorList').find('tr').first();
      actualLen = actual.length;

      expect(actualLen).toEqual(1);
      expect(actual.data('symbol')).toEqual(expected.symbol);
    });
    it('should add an investment to the top of the group specified', function() {
      var expected,
          expectedGroup,
          actual,
          actualLen;

      expectedGroup = {name: 'TestGroup A'};
      expected = {
        symbol: 'SYB',
        group: expectedGroup,
        fields: {
          symbol: {val: 'SYB'}
        }
      };
      this.component.addGroup(expectedGroup);

      $(document).trigger('data-added_investment', {investment: expected});

      actual = this.component.findGroup(expectedGroup.name).next();
      actualLen = actual.length;

      expect(actualLen).toEqual(1);
      expect(actual.data('symbol')).toEqual(expected.symbol);
    });
    it('should add an investment to the top of the group specified with multiple',
       function() {
      var expected,
          expectedGroup,
          testSymbol,
          actual,
          actualLen;

      expectedGroup = {name: 'TestGroup A'};
      testSymbol = {
        symbol: 'SYA',
        group: expectedGroup,
        fields: {
          symbol: {val: 'SYA'}
        }
      };
      expected = {
        symbol: 'SYC',
        group: expectedGroup,
        fields: {
          symbol: {val: 'SYC'}
        }
      };
      this.component.addGroup(expectedGroup);

      $(document).trigger('data-added_investment', {investment: testSymbol});
      $(document).trigger('data-added_investment', {investment: expected});

      actual = this.component.findGroup(expectedGroup.name).next();
      actualLen = actual.length;

      expect(actualLen).toEqual(1);
      expect(actual.data('symbol')).toEqual(expected.symbol);
    });
  });

  describe('on data-added_group', function() {
    it('should trigger a ui-added_group event with the group', function() {
      var expected,
          eventSpy;

      expected = {name: 'testGroupA'};
      eventSpy = spyOnEvent(document, 'ui-added_group');

      $(document).trigger('data-added_group', {group: expected});

      expect(eventSpy.mostRecentCall.data).toEqual({group: expected});
    });
    it('should add the new group to the bottom of the table', function() {
      var testGroup,
          template = Hogan.compile(this.component.attr.tmpltextGroupTr),
          expected,
          actual;

      testGroup = {name: 'testGroupA'};
      expected = $.trim(template.render($.extend(testGroup, {numCols: 18})));

      $(document).trigger('data-added_group', {group: testGroup});

      actual = this.component.select('selectorGroups')
          .last()
          .prop('outerHTML');

      expect(actual).toEqual(expected);
    });
    it('should add the new group below existing groups', function() {
      var testGroup,
          template = Hogan.compile(this.component.attr.tmpltextGroupTr),
          expected,
          actualLen,
          actual;

      testGroup = {name: 'testGroupA'};
      expected = $.trim(template.render($.extend(testGroup, {numCols: 18})));

      $(document).trigger('data-added_group', {group: {name: 'testGroupX'}});
      $(document).trigger('data-added_group', {group: testGroup});

      actualLen = this.component.select('selectorGroups').length;
      actual = this.component.select('selectorGroups').last();

      expect(actualLen).toEqual(2);
      expect(actual.prop('outerHTML')).toEqual(expected);
    });
  });

  describe('on click investment update', function() {
    it('should trigger a ui-update_investment event on itself with investment ' +
       'object', function() {
      var expected,
          eventSpy,
          testInvestment,
          entryUpdateSelector;

      testInvestment = {
        id: 3,
        symbol: 'SYN',
        fields: {
          symbol: {val: 'SYN'}
        }
      };
      expected = {
        id: 3,
        symbol: 'SYN'
      };
      eventSpy = spyOnEvent(document, 'ui-update_investment');
      this.component.addInvestmentNoGroup(testInvestment);

      entryUpdateSelector = this.component.findInvestment(expected.symbol)
          .find(this.component.attr.selectorEntryUpdate)
          .selector;

      this.component.trigger(entryUpdateSelector, 'click');

      expect(eventSpy.mostRecentCall.data).toEqual({investment: expected});
    });
  });

  describe('on click investment field', function() {
    it('should trigger a ui-edit_investment_field event on itself with investment '+
       'and field', function() {
      var expected,
          eventSpy,
          testInvestment,
          field = 'MarketCap',
          entryFieldSelector;

      testInvestment = {
        symbol: 'SYO',
        fields: {
          symbol: {val: 'SYO'}
        }
      };
      expected = {
        symbol: 'SYO',
        field: field
      };
      eventSpy = spyOnEvent(document, 'ui-edit_investment_field');
      this.component.addInvestmentNoGroup(testInvestment);

      entryFieldSelector = this.component.findInvestment(testInvestment.symbol)
          .find('td[name="'+ field +'"]')
          .selector;

      this.component.trigger(entryFieldSelector, 'dblclick');

      expect(eventSpy.mostRecentCall.data).toEqual({investment: expected});
    });
  });

  describe('on click investment delete', function() {
    it('should trigger a ui-delete_investment event on itself with inv object',
       function() {
      var expected,
          eventSpy,
          entryDeleteSelector;

      testInvestment = {
        id: 3,
        symbol: 'SYR',
        fields: {
          symbol: {val: 'SYR'}
        }
      };
      expected = {symbol: 'SYR', id: 3};
      eventSpy = spyOnEvent(document, 'ui-delete_investment');
      this.component.addInvestmentNoGroup(testInvestment);

      entryDeleteSelector = this.component.findInvestment(expected.symbol)
          .find(this.component.attr.selectorEntryDelete)
          .selector;

      this.component.trigger(entryDeleteSelector, 'click');

      expect(eventSpy.mostRecentCall.data).toEqual({investment: expected});
     });
  });

  describe('on data-updated_investments', function() {
    it('should trigger a ui-updated_investments event on itself', function() {
      var testInvestment,
          expected,
          eventSpy;

      expected = [{
        symbol: 'SYR',
        fields: {
          symbol: {val: 'SYR'},
          cap: {val: 12},
          assets: {val: 102}
        }
      }];
      eventSpy = spyOnEvent(document, 'ui-updated_investments');
      this.component.addInvestmentNoGroup(expected);

      $(document).trigger('data-updated_investments', {investments:
                          expected});

      expect(eventSpy.mostRecentCall.data).toEqual({investments: expected});
     });
    it('should update the fields to new values for one updated one', function() {
      var testInvestment,
          expected,
          expectedCap,
          expectedAssets,
          actualCap,
          actualAssets,
          $testInvestment;

      testInvestment = {
        symbol: 'SYR',
        fields: {
          symbol: {val: 'SYR'},
          MarketCap: {content: 11},
          TotalCash: {content: 101}
        }
      };
      expectedCap = 12;
      expectedAssets = 102;
      expected = [{
        symbol: 'SYR',
        fields: {
          symbol: {val: 'SYR'},
          MarketCap: {content: expectedCap},
          TotalCash: {content: expectedAssets}
        }
      }];
      this.component.addInvestmentNoGroup(testInvestment);
      $testInvestment = this.component.findInvestment(testInvestment.symbol);

      actualCap = $testInvestment.find('td[name="MarketCap"]').data('val');
      actualAssets = $testInvestment.find('td[name="TotalCash"]').data('val');
      expect(actualCap).toEqual(11);
      expect(actualAssets).toEqual(101);

      $(document).trigger('data-updated_investments', {investments:
                          expected});

      $testInvestment = this.component.findInvestment(testInvestment.symbol);
      actualCap = $testInvestment.find('td[name="MarketCap"]').data('val');
      actualAssets = $testInvestment.find('td[name="TotalCash"]').data('val');

      expect(actualCap).toEqual(expectedCap);
      expect(actualAssets).toEqual(expectedAssets);
    });
    it('should upated the fields for multiple updated investments', function() {
      var testInvestmentA,
          testInvestmentB,
          $testInvestmentA,
          $testInvestmentB,
          expected,
          aCap,
          bCap,
          bAssets,
          expectedACap,
          expectedBCap,
          expectedBAssets;

      testInvestmentA = {
        symbol: 'TNA',
        fields: {
          symbol: {val: 'TNA'},
          MarketCap: {content: 11}
        }
      };
      testInvestmentB = {
        symbol: 'TNB',
        fields: {
          symbol: {val: 'TNB'},
          MarketCap: {content: 21},
          TotalCash: {content: 201}
        }
      };
      this.component.addInvestmentNoGroup(testInvestmentA);
      this.component.addInvestmentNoGroup(testInvestmentB);
      $testInvestmentA = this.component.findInvestment(testInvestmentA.symbol);
      $testInvestmentB = this.component.findInvestment(testInvestmentB.symbol);
      aCap = $testInvestmentA.children('td[name="MarketCap"]').data('val');
      bCap = $testInvestmentB.find('td[name="MarketCap"]').data('val');
      bAssets = $testInvestmentB.find('td[name="TotalCash"]').data('val');

      expect(aCap).toEqual(11);
      expect(bCap).toEqual(21);
      expect(bAssets).toEqual(201);

      expectedACap = 12;
      expectedBCap = 22;
      expectedBAssets = 202;
      expected = [
        { symbol: 'TNA',
          fields: {
            symbol: {val: 'TNA'},
            MarketCap: {content: expectedACap}
          }
        },
        { symbol: 'TNB',
          fields: {
            symbol: {val: 'TNB'},
            MarketCap: {content: expectedBCap},
            TotalCash: {content: expectedBAssets}
          }
        }
      ];

      $(document).trigger('data-updated_investments', {investments:
                          expected});

      $testInvestmentA = this.component.findInvestment(testInvestmentA.symbol);
      $testInvestmentB = this.component.findInvestment(testInvestmentB.symbol);
      aCap = $testInvestmentA.children('td[name="MarketCap"]').data('val');
      bCap = $testInvestmentB.find('td[name="MarketCap"]').data('val');
      bAssets = $testInvestmentB.find('td[name="TotalCash"]').data('val');

      expect(aCap).toEqual(expectedACap);
      expect(bCap).toEqual(expectedBCap);
      expect(bAssets).toEqual(expectedBAssets);
    });
    it('should not update anything if theres no updated fields', function() {
      var testInvestment,
          $testInvestment,
          expected,
          expectedCap,
          expectedAssets,
          actualCap,
          actualAssets;

      expectedCap = 10;
      expectedAssets = 101;
      expected = {
        symbol: 'SYR',
        fields: {
          symbol: {val: 'SYR'},
          MarketCap: {content: expectedCap},
          TotalCash: {content: expectedAssets}
        }
      };
      this.component.addInvestmentNoGroup(expected);

      $(document).trigger('data-updated_investments', {investments:
                          {symbol: 'SYR'}});

      $testInvestment = this.component.findInvestment(expected.symbol);

      actualCap = $testInvestment.find('td[name="MarketCap"]').data('val');
      actualAssets = $testInvestment.find('td[name="TotalCash"]').data('val');

      expect(expectedCap).toEqual(actualCap);
      expect(expectedAssets).toEqual(actualAssets);
    });
  });

  describe('on data-deleted_investment', function() {
    it('should remove the lone investment from DOM if found', function() {
      var expected,
          expectedSymbolSelector,
          actual;

      testInvestment = {
        symbol: 'SYT',
        fields: {
          symbol: {val: 'SYT'}
        }
      };
      expected = {symbol: 'SYT', id: 9};
      this.component.addInvestmentNoGroup(testInvestment);
      actual = this.component.findInvestment(expected.symbol);

      expect(actual.length).toEqual(1);

      $(document).trigger('data-deleted_investment', {investment: expected});

      actual = this.component.findInvestment(expected.symbol);
      expect(actual.length).toEqual(0);
    });
    it('should remove the grouped investment from DOM if found', function() {
      var expected,
          expectedSymbolSelector,
          testGroup,
          actual;

      testGroup = {
        name: 'testG1'
      };
      testInvestment = {
        symbol: 'SYT',
        group: testGroup,
        fields: {
          symbol: {val: 'SYT'}
        }
      };
      expected = {symbol: 'SYT'};

      this.component.addGroup(testGroup);
      this.component.addInvestmentNoGroup(testInvestment);
      actual = this.component.findInvestment(expected.symbol);

      expect(actual.length).toEqual(1);

      $(document).trigger('data-deleted_investment', {investment: expected});

      actual = this.component.findInvestment(expected.symbol);
      expect(actual.length).toEqual(0);
    });
    it('should trigger a ui-deleted_investment on itself', function() {
      var expected,
          eventSpy;

      testInvestment = {
        symbol: 'SYX',
        fields: {
          symbol: {val: 'SYX'}
        }
      };
      expected = {symbol: 'SYX'};
      eventSpy = spyOnEvent(document, 'ui-deleted_investment');
      this.component.addInvestmentNoGroup(testInvestment);

      $(document).trigger('data-deleted_investment', {investment: expected});

      expect(eventSpy.mostRecentCall.data).toEqual({investment: expected});
    });
  });

  describe('on data-deleted_group', function() {
    it('should not remove any group if group name doesn\t exist',
       function() {
      var deadGroup,
          testGroup,
          actual;

      deadGroup = {};
      testGroup = {name: 'TestGroup A'};
      this.component.addGroup(testGroup);
      this.component.addInvestmentToGroup(testInvestment, testGroup);

      actual = this.component.findInvestment(testInvestment.symbol);
      expect(actual.length).toEqual(1);

      $(document).trigger('data-deleted_group', {group: deadGroup});

      actual = this.component.findInvestment(testInvestment.symbol);

      expect(actual.length).toEqual(1);
     });
    it('should not remove any group from the DOM if group doesn\'t exist',
       function() {
      var deadGroup,
          testGroup,
          actual;

      deadGroup = {name: 'Non-existant'};
      testGroup = {name: 'TestGroup A'};
      this.component.addGroup(testGroup);
      this.component.addInvestmentToGroup(testInvestment, testGroup);

      actual = this.component.findInvestment(testInvestment.symbol);
      expect(actual.length).toEqual(1);

      $(document).trigger('data-deleted_group', {group: deadGroup});

      actual = this.component.findInvestment(testInvestment.symbol);

      expect(actual.length).toEqual(1);
     });
     it('should remove the group from the DOM, placing the investments in clear',
        function() {
      var expectedGroup,
          actual,
          expectedInvestment;

      expectedGroup = {name: 'tGroupB'};
      expectedInvestment = testInvestment;
      expectedInvestment.group = expectedGroup;

      this.component.addGroup(expectedGroup);
      this.component.addInvestmentToGroup(expectedInvestment,
                                          expectedGroup);

      actual = this.component.findGroup(expectedGroup.name);
      expect(actual.length).toEqual(1);
      // Ensure the first thing below the group is the correct investment.
      expect(actual.next().data('symbol')).toEqual(expectedInvestment.symbol);

      $(document).trigger('data-deleted_group', {group: expectedGroup});

      actual = this.component.findGroup(expectedGroup.name);
      expect(actual.length).toEqual(0);
      actual = this.component.select('selectorList').find('tr').first();
      // Ensure the investment gets moved to the top of the list.
      expect(actual.data('symbol')).toEqual(expectedInvestment.symbol);
    });
  });
});
