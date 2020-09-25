const assert = require('assert')
const { cleanRows, convertArrayToObject, createArrayOfArrays, fillArray, generateUrl } = require('../functions')

const mockArrayToClean = [
  '', '    ', '\t', '\t    ', '            2020-04-27',
  '            Mon', '\t    ', '       ', '\t    ',
  '            --', '            116,620,154                    \t\t']
const mockArrayOfArrays = [[], [], []]
const mockTableRows = [
  '2020-04-27', '--', '116620154',
  '2020-04-28', '--', '116720154',
  '2020-04-29', '--', '116820154'
]
const mockFilledArray = [
  ['2020-04-27', '--', '116620154', '1', '4', '7', '+1'],
  ['2020-04-28', '--', '116720154', '2', '5', '8', '-1'],
  ['2020-04-29', '--', '116820154', '3', '6', '9', '+2']
]

describe('Tests for socialblade-com-api', () => {
  it('should generate the url', () => {
    const url1 = generateUrl('prefix', 'twitter', 'barackobama')
    const url2 = generateUrl('prefix', 'facebook', 'barackobama')
    assert.strictEqual(url1, 'prefixhttps://socialblade.com/twitter/user/barackobama/monthly')
    assert.strictEqual(url2, 'prefixhttps://socialblade.com/facebook/page/barackobama')
  })

  it('should clean an array from unwanted chars', () => {
    const cleanedArray = cleanRows(mockArrayToClean)
    assert.strictEqual(cleanedArray.length, 3)
    assert.strictEqual(cleanedArray[0], '2020-04-27')
    assert.strictEqual(cleanedArray[1], '--')
    assert.strictEqual(cleanedArray[2], '116620154')
  })

  it('should create an array of N arrays', () => {
    const arrayOfArrays = createArrayOfArrays(3)
    assert.strictEqual(arrayOfArrays.length, 3)
    assert.strictEqual(arrayOfArrays[0].length, 0)
    assert.strictEqual(arrayOfArrays[1].length, 0)
    assert.strictEqual(arrayOfArrays[2].length, 0)
  })

  it('should fill arrays inside an array', () => {
    const filledArray = fillArray(mockArrayOfArrays, mockTableRows, 3)
    assert.strictEqual(filledArray.length, 3)
    assert.strictEqual(filledArray[0].length, 3)
    assert.strictEqual(filledArray[1].length, 3)
    assert.strictEqual(filledArray[2].length, 3)
    assert.strictEqual(filledArray[0][0], '2020-04-27')
    assert.strictEqual(filledArray[0][1], '--')
    assert.strictEqual(filledArray[0][2], '116620154')
    assert.strictEqual(filledArray[1][0], '2020-04-28')
    assert.strictEqual(filledArray[1][1], '--')
    assert.strictEqual(filledArray[1][2], '116720154')
    assert.strictEqual(filledArray[2][0], '2020-04-29')
    assert.strictEqual(filledArray[2][1], '--')
    assert.strictEqual(filledArray[2][2], '116820154')
  })

  it('should convert an array to object', () => {
    const convertedArray = convertArrayToObject('twitter', mockFilledArray)
    assert.strictEqual(convertedArray.length, 3)
    assert.strictEqual(convertedArray[0].date, '2020/04/27')
    assert.strictEqual(convertedArray[0].followersDelta, 0)
    assert.strictEqual(convertedArray[0].followers, 116620154)
    assert.strictEqual(convertedArray[0].followingDelta, 1)
    assert.strictEqual(convertedArray[0].following, 4)
    assert.strictEqual(convertedArray[0].postsDelta, 7)
    assert.strictEqual(convertedArray[0].posts, 1)
    assert.strictEqual(convertedArray[1].date, '2020/04/28')
    assert.strictEqual(convertedArray[1].followersDelta, 0)
    assert.strictEqual(convertedArray[1].followers, 116720154)
    assert.strictEqual(convertedArray[1].followingDelta, 2)
    assert.strictEqual(convertedArray[1].following, 5)
    assert.strictEqual(convertedArray[1].postsDelta, 8)
    assert.strictEqual(convertedArray[1].posts, -1)
    assert.strictEqual(convertedArray[2].date, '2020/04/29')
    assert.strictEqual(convertedArray[2].followersDelta, 0)
    assert.strictEqual(convertedArray[2].followers, 116820154)
    assert.strictEqual(convertedArray[2].followingDelta, 3)
    assert.strictEqual(convertedArray[2].following, 6)
    assert.strictEqual(convertedArray[2].postsDelta, 9)
    assert.strictEqual(convertedArray[2].posts, 2)
  })
})
