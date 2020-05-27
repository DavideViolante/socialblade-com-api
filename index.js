const axios = require('axios')
const cheerio = require('cheerio')

const { cleanRows, createArrayOfArrays, fillArray, convertArrayToObject } = require('./functions')

function callSocialblade (username, config) {
  return axios({
    method: 'GET',
    url: `${config ? `${config.url}?key=${config.key}&url=` : ''}http://socialblade.com/twitter/user/${username}/monthly`
  })
}

async function socialblade (username, config) {
  try {
    const html = await callSocialblade(username, config)
    const $ = cheerio.load(html.data)
    const table = $('#socialblade-user-content > div:nth-child(5)').text()
    const tableRows = cleanRows(table.split('\n'))
    const itemsPerRow = 7
    let arrays = createArrayOfArrays(tableRows.length / itemsPerRow)
    arrays = fillArray(arrays, tableRows, itemsPerRow)
    const array2obj = convertArrayToObject(arrays)
    return array2obj
  } catch (err) {
    console.log(err)
  }
}

exports.socialblade = socialblade
