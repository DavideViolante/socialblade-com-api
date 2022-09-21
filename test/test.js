/* eslint-disable max-len */
const assert = require('assert');
const { cleanRows, convertArrayToObject, createArrayOfArrays, fillArray, generateUrl } = require('../functions');

const mockTableToClean = [
  '', '    ', '\t', '\t    ', '            2020-04-27',
  '            Mon', '\t    ', '       ', '\t    ',
  '            --', '            116,620,154                    \t\t'];
const mockChartsToClean = [
  '',
  '\t',
  '\t    $(function () { ',
  '',
  '      ',
  '            Highcharts.chart(\'graph-twitter-weekly-change-followers-container\', {',
  '            chart: { type: \'area\', zoomType: \'xy\', resetZoomButton: { position: { x: 0,  y: -52 } } },  ',
  '            credits: { enabled: false },\t\t    ',
  '            title: { text: \'Weekly Followers Gained for \\\'Nike\\\'\' },',
  '            yAxis: { title: { text: \'Followers\' }, minorGridLineWidth: 1, gridLineWidth: 1, alternateGridColor: null, },',
  '            series: [{ name: \'\', showInLegend: false, animation: false, color: \'#c84329\', lineWidth: 2, data: [[1466481600000,11962],[1467000000000,14270],[1467604800000,13884],[1468209600000,14675],[1468814400000,25269]] }],',
  '        });\t\t ',
  ''];
const mockTableArrayOfArrays = [[], [], []];
const mockChartsArrayOfArrays = [[], []];
const mockTableRows = [
  '2020-04-27', '--', '116620154',
  '2020-04-28', '--', '116720154',
  '2020-04-29', '--', '116820154',
];
const mockChartsRows = [
  'Weekly Followers Gained for Nike',
  '[[1466481600000,11962],[1467000000000,14270],[1467604800000,13884],[1468209600000,14675],[1468814400000,25269]]',
  'Weekly Following Gained for Nike',
  '[[1466481600000,1196],[1467000000000,1427],[1467604800000,1388],[1468209600000,1467],[1468814400000,2526]]',
];
const mockTableFilledArray = [
  ['2020-04-27', '--', '116620154', '1', '4', '7', '+1'],
  ['2020-04-28', '--', '116720154', '2', '5', '8', '-1'],
  ['2020-04-29', '--', '116820154', '3', '6', '9', '+2'],
];
const mockChartsFilledArray = [
  ['Weekly Followers Gained for Nike', '[[1466481600000,11962],[1467000000000,14270],[1467604800000,13884],[1468209600000,14675],[1468814400000,25269]]'],
  ['Weekly Following Gained for Nike', '[[1466481600000,1196],[1467000000000,1427],[1467604800000,1388],[1468209600000,1467],[1468814400000,2526]]'],
];

describe('Tests for socialblade-com-api', () => {
  it('should generate the url', () => {
    const url1 = generateUrl('twitter', 'barackobama');
    const url2 = generateUrl('facebook', 'barackobama');
    assert.strictEqual(url1, 'https://socialblade.com/twitter/user/barackobama/monthly');
    assert.strictEqual(url2, 'https://socialblade.com/facebook/page/barackobama');
  });

  it('should clean an array from unwanted chars', () => {
    const { tableRows, chartsRows } = cleanRows(mockTableToClean, mockChartsToClean);
    assert.strictEqual(tableRows.length, 3);
    assert.strictEqual(tableRows[0], '2020-04-27');
    assert.strictEqual(tableRows[1], '--');
    assert.strictEqual(tableRows[2], '116620154');
    assert.strictEqual(chartsRows.length, 2);
    assert.strictEqual(chartsRows[0], 'Weekly Followers Gained for Nike');
    assert.strictEqual(chartsRows[1], '[[1466481600000,11962],[1467000000000,14270],[1467604800000,13884],[1468209600000,14675],[1468814400000,25269]]');
  });

  it('should create an array of N arrays', () => {
    const arrayOfArrays = createArrayOfArrays(3);
    assert.strictEqual(arrayOfArrays.length, 3);
    assert.strictEqual(arrayOfArrays[0].length, 0);
    assert.strictEqual(arrayOfArrays[1].length, 0);
    assert.strictEqual(arrayOfArrays[2].length, 0);
  });

  it('should fill arrays inside an array', () => {
    const tableFilledArray = fillArray(mockTableArrayOfArrays, mockTableRows, 3);
    assert.strictEqual(tableFilledArray.length, 3);
    assert.strictEqual(tableFilledArray[0].length, 3);
    assert.strictEqual(tableFilledArray[1].length, 3);
    assert.strictEqual(tableFilledArray[2].length, 3);
    assert.strictEqual(tableFilledArray[0][0], '2020-04-27');
    assert.strictEqual(tableFilledArray[0][1], '--');
    assert.strictEqual(tableFilledArray[0][2], '116620154');
    assert.strictEqual(tableFilledArray[1][0], '2020-04-28');
    assert.strictEqual(tableFilledArray[1][1], '--');
    assert.strictEqual(tableFilledArray[1][2], '116720154');
    assert.strictEqual(tableFilledArray[2][0], '2020-04-29');
    assert.strictEqual(tableFilledArray[2][1], '--');
    assert.strictEqual(tableFilledArray[2][2], '116820154');
    const chartsFilledArray = fillArray(mockChartsArrayOfArrays, mockChartsRows, 2);
    assert.strictEqual(chartsFilledArray.length, 2);
    assert.strictEqual(chartsFilledArray[0].length, 2);
    assert.strictEqual(chartsFilledArray[1].length, 2);
    assert.strictEqual(chartsFilledArray[0][0], 'Weekly Followers Gained for Nike');
    assert.strictEqual(chartsFilledArray[0][1], '[[1466481600000,11962],[1467000000000,14270],[1467604800000,13884],[1468209600000,14675],[1468814400000,25269]]');
    assert.strictEqual(chartsFilledArray[1][0], 'Weekly Following Gained for Nike');
    assert.strictEqual(chartsFilledArray[1][1], '[[1466481600000,1196],[1467000000000,1427],[1467604800000,1388],[1468209600000,1467],[1468814400000,2526]]');
  });

  it('should convert an array to object', () => {
    const tableConvertedArray = convertArrayToObject('twitter', mockTableFilledArray);
    assert.strictEqual(tableConvertedArray.length, 3);
    assert.strictEqual(tableConvertedArray[0].date, '2020/04/27');
    assert.strictEqual(tableConvertedArray[0].followersDelta, 0);
    assert.strictEqual(tableConvertedArray[0].followers, 116620154);
    assert.strictEqual(tableConvertedArray[0].followingDelta, 1);
    assert.strictEqual(tableConvertedArray[0].following, 4);
    assert.strictEqual(tableConvertedArray[0].postsDelta, 7);
    assert.strictEqual(tableConvertedArray[0].posts, 1);
    assert.strictEqual(tableConvertedArray[1].date, '2020/04/28');
    assert.strictEqual(tableConvertedArray[1].followersDelta, 0);
    assert.strictEqual(tableConvertedArray[1].followers, 116720154);
    assert.strictEqual(tableConvertedArray[1].followingDelta, 2);
    assert.strictEqual(tableConvertedArray[1].following, 5);
    assert.strictEqual(tableConvertedArray[1].postsDelta, 8);
    assert.strictEqual(tableConvertedArray[1].posts, -1);
    assert.strictEqual(tableConvertedArray[2].date, '2020/04/29');
    assert.strictEqual(tableConvertedArray[2].followersDelta, 0);
    assert.strictEqual(tableConvertedArray[2].followers, 116820154);
    assert.strictEqual(tableConvertedArray[2].followingDelta, 3);
    assert.strictEqual(tableConvertedArray[2].following, 6);
    assert.strictEqual(tableConvertedArray[2].postsDelta, 9);
    assert.strictEqual(tableConvertedArray[2].posts, 2);
    const chartsConvertedArray = convertArrayToObject('charts', mockChartsFilledArray);
    assert.strictEqual(chartsConvertedArray[0].id, 'weekly-followers-gained');
    assert.strictEqual(chartsConvertedArray[0].title, 'Weekly Followers Gained for Nike');
    assert.strictEqual(chartsConvertedArray[0].data.length, 5);
    assert.strictEqual(chartsConvertedArray[0].data[0].date, '2016/06/21');
    assert.strictEqual(chartsConvertedArray[0].data[0].value, 11962);
    assert.strictEqual(chartsConvertedArray[1].id, 'weekly-following-gained');
    assert.strictEqual(chartsConvertedArray[1].title, 'Weekly Following Gained for Nike');
    assert.strictEqual(chartsConvertedArray[1].data.length, 5);
    assert.strictEqual(chartsConvertedArray[1].data[0].date, '2016/06/21');
    assert.strictEqual(chartsConvertedArray[1].data[0].value, 1196);
  });
});
