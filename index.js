const axios = require('axios')

const {
  getOutput,
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
  return axios.get(url)
}

async function socialblade (urlPrefix, source, username) {
  try {
    if (!isValidSource(source)) {
      throw Error(`Invalid source. Valid sources are: ${validSources.join(', ')}`)
    }
    const url = generateUrl(urlPrefix, source, username)
    const html = await callSocialblade(url)
    const { table, charts } = getOutput(html.data, source)
    const { tableRows, chartsRows } = cleanRows(table, charts)
    const itemsPerRow = { twitter: 7, instagram: 7, facebook: 5, youtube: 6 }
    let tableArrays = createArrayOfArrays(tableRows.length / itemsPerRow[source])
    tableArrays = fillArray(tableArrays, tableRows, itemsPerRow[source])
    const tableArrayOfObjects = convertArrayToObject(source, tableArrays)
    let chartsArrays = createArrayOfArrays(chartsRows.length / 2)
    chartsArrays = fillArray(chartsArrays, chartsRows, 2)
    const chartsArrayOfObjects = convertArrayToObject('charts', chartsArrays)
    return { table: tableArrayOfObjects, charts: chartsArrayOfObjects }
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
