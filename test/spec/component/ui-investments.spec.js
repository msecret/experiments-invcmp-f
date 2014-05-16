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
