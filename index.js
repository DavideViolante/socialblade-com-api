const axios = require('axios')
const cheerio = require('cheerio')

const {
  cleanRows,
  createArrayOfArrays,
  convertArrayToObject,
  fillArray,
  isValidSource,
  validSources
} = require('./functions')

let retries = 2

function callSocialblade (urlPrefix, source, username) {
  return axios({
    method: 'GET',
    url: `${urlPrefix}https://socialblade.com/${source}/user/${username}/monthly`
  })
}

async function socialblade (urlPrefix, source, username) {
  try {
    if (!isValidSource(source)) {
      throw Error(`Invalid source. Valid sources are: ${validSources.join(', ')}`)
    }
    const html = await callSocialblade(urlPrefix, source, username)
    const $ = cheerio.load(html.data)
    const table = $('#socialblade-user-content > div:nth-child(5)').text()
    const tableRows = cleanRows(table.split('\n'))
    const itemsPerRow = 7
    let arrays = createArrayOfArrays(tableRows.length / itemsPerRow)
    arrays = fillArray(arrays, tableRows, itemsPerRow)
    const array2obj = convertArrayToObject(arrays)
    return array2obj
  } catch (err) {
    console.log(err.response ? err.response.data : err)
    if (retries > 0) {
      retries--
      console.log('Failed once, retrying...')
      return socialblade(urlPrefix, source, username)
    } else {
      console.log('Request failed too many times, aborting.')
    }
  }
}

exports.socialblade = socialblade
