const axios = require('axios')
const cheerio = require('cheerio')

const {
  cleanRows,
  createArrayOfArrays,
  convertArrayToObject,
  fillArray,
  generateUrl,
  isValidSource,
  validSources
} = require('./functions')

let retries = 2

function callSocialblade (url) {
  return axios({
    method: 'GET',
    url
  })
}

async function socialblade (urlPrefix, source, username) {
  try {
    if (!isValidSource(source)) {
      throw Error(`Invalid source. Valid sources are: ${validSources.join(', ')}`)
    }
    const url = generateUrl(urlPrefix, source, username)
    const html = await callSocialblade(url)
    const $ = cheerio.load(html.data)
    const table = $('#socialblade-user-content > div:nth-child(5)').text()
    const tableRows = cleanRows(table.split('\n'))
    const itemsPerRowCriteria = { facebook: 5, youtube: 6 }
    const itemsPerRow = itemsPerRowCriteria[source] || 7
    let arrays = createArrayOfArrays(tableRows.length / itemsPerRow)
    arrays = fillArray(arrays, tableRows, itemsPerRow)
    const array2obj = convertArrayToObject(source, arrays)
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
