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
        '<th name="cap">Cap</th>'+
        '<th name="price">Price</th>'+
        '<th name="priceChangeYTD">Price change ytd</th>'+
        '<th name="trackingError">Tracking error</th>'+
        '<th name="assets">Assets</th>'+
        '<th name="volume">Volume</th>'+
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

  describe('on data-added_investment', function() {
    it('should trigger a ui-added_investment event', function() {
      var expected,
          eventSpy;

      eventSpy = spyOnEvent(document, 'ui-added_investment');

      $(document).trigger('data-added_investment', 
                          {investment: testInvestment});

      expect(eventSpy.mostRecentCall.data).toEqual(testInvestment);
    });
    it('should not trigger a ui-added_investment event if theres no symbol in data', 
       function() {
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
        symbol: 'SYN',
        fields: {
          symbol: {val: 'SYN'}
        }
      };
      expected = {
        symbol: 'SYN'
      };
      eventSpy = spyOnEvent(document, 'ui-update_investment');
      this.component.addInvestmentNoGroup(testInvestment.fields);

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
          field = 'cap',
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
      this.component.addInvestmentNoGroup(testInvestment.fields);

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
        symbol: 'SYR',
        fields: {
          symbol: {val: 'SYR'}
        }
      };
      expected = {symbol: 'SYR'};
      eventSpy = spyOnEvent(document, 'ui-delete_investment');
      this.component.addInvestmentNoGroup(testInvestment.fields);

      entryDeleteSelector = this.component.findInvestment(expected.symbol)
          .find(this.component.attr.selectorEntryDelete)
          .selector;

      this.component.trigger(entryDeleteSelector, 'click');

      expect(eventSpy.mostRecentCall.data).toEqual({investment: expected});
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
      expected = {symbol: 'SYT'};
      this.component.addInvestmentNoGroup(testInvestment.fields);
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
      this.component.addInvestmentNoGroup(testInvestment.fields);
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
      this.component.addInvestmentNoGroup(testInvestment.fields);

      $(document).trigger('data-deleted_investment', {investment: expected});

      expect(eventSpy.mostRecentCall.data).toEqual({investment: expected});
    });
  });
});
