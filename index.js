require('dotenv').config()

const axios = require('axios')
const cheerio = require('cheerio')

const { PROXY } = process.env
const { cleanRows, createArrayOfArrays, fillArray, convertArrayToObject } = require('./functions')

function callSocialblade (username, useProxy) {
  return axios({
    method: 'GET',
    url: `${useProxy ? PROXY : ''}http://socialblade.com/twitter/user/${username}/monthly`
  })
}

async function socialblade (username, useProxy) {
  try {
    const html = await callSocialblade(username, useProxy)
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
