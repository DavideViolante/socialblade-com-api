const axios = require('axios')
const cheerio = require('cheerio')

const { cleanRows, createArrayOfArrays, fillArray, convertArrayToObject } = require('./functions')

async function socialblade (username) {
  const html = await axios(`https://socialblade.com/twitter/user/${username}/monthly`)
  const $ = cheerio.load(html.data)
  const table = $('#socialblade-user-content > div:nth-child(5)').text()
  const tableRows = cleanRows(table.split('\n'))
  const itemsPerRow = 7
  let arrays = createArrayOfArrays(tableRows.length / itemsPerRow)
  arrays = fillArray(arrays, tableRows, itemsPerRow)
  const array2obj = convertArrayToObject(arrays)
  return array2obj
}

exports.socialblade = socialblade
