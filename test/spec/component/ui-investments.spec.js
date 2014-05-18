'use strict';

describeComponent('component/ui-investments', function () {

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
  });

  it('should be defined', function () {
    expect(this.component).toBeDefined();
  });

  describe('on data-added_symbol', function() {
    it('should trigger a ui-added_symbol event', function() {
      var expected,
          eventSpy;

      expected = {symbol: 'SYN'};
      eventSpy = spyOnEvent(document, 'ui-added_symbol');

      $(document).trigger('data-added_symbol', {symbol: expected});

      expect(eventSpy.mostRecentCall.data).toEqual({symbol: expected});
    });
    it('should not trigger a ui-added_symbol event if theres no symbol in data', 
       function() {
      var expected,
          eventSpy;

      expected = null;
      eventSpy = spyOnEvent(document, 'ui-added_symbol');

      $(document).trigger('data-added_symbol', {symbol: expected});

      expect(!eventSpy.called);
    });
    it('should not trigger a ui-added_symbol event if the symbol has no symbol ' +
        'property', function() {
      var expected,
          eventSpy;

      expected = {symbol: null};
      eventSpy = spyOnEvent(document, 'ui-added_symbol');

      $(document).trigger('data-added_symbol', {symbol: expected});

      expect(!eventSpy.called);
    });
    it('should add the symbol to the top of the list if no group specified',
       function() {
      var expected,
          actual,
          actualLen;

      expected = {symbol: 'SYN'};

      $(document).trigger('data-added_symbol', {symbol: expected});

      actual = this.component.select('selectorListEntry').first();
      actualLen = actual.length;

      expect(actualLen).toEqual(1);
      expect(actual.data('symbol')).toEqual(expected.symbol);
    });
    it('should add multiple symbols to the top of the list if no group specified',
       function() {
      var expected,
          testSym1,
          actual,
          actualLen;

      testSym1 = {symbol: 'SYB'};
      expected = {symbol: 'SYN'};

      $(document).trigger('data-added_symbol', {symbol: testSym1});
      $(document).trigger('data-added_symbol', {symbol: expected});

      actual = this.component.select('selectorListEntry').first();
      actualLen = actual.length;

      expect(actualLen).toEqual(1);
      expect(actual.data('symbol')).toEqual(expected.symbol);
    });
    it('should add a symbol to the top of the group specified', function() {
      var expected,
          expectedGroup,
          actual,
          actualLen;

      expectedGroup = {name: 'TestGroup A'};
      expected = {symbol: 'SYN', group: expectedGroup};
      this.component.addGroup(expectedGroup);

      $(document).trigger('data-added_symbol', {symbol: expected});

      actual = this.component.findGroup(expectedGroup.name).next();
      actualLen = actual.length;

      expect(actualLen).toEqual(1);
      expect(actual.data('symbol')).toEqual(expected.symbol);
    });
    it('should add a symbol to the top of the group specified with multiple',
       function() {
      var expected,
          expectedGroup,
          testSymbol,
          actual,
          actualLen;

      expectedGroup = {name: 'TestGroup A'};
      testSymbol = {symbol: 'TST', group: expectedGroup};
      expected = {symbol: 'SYN', group: expectedGroup};
      this.component.addGroup(expectedGroup);

      $(document).trigger('data-added_symbol', {symbol: testSymbol});
      $(document).trigger('data-added_symbol', {symbol: expected});

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
});
