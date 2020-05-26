const axios = require('axios')
const cheerio = require('cheerio')

function cleanRows (rows) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return rows
    .map(row => row.replace(new RegExp(/(\t|\s|,|\+)+/, 'g'), ''))
    .filter(row => row && !days.includes(row))
}

function createArrayOfArrays (n) {
  const arrays = []
  for (let i = 0; i < n; i++) {
    arrays.push([])
  }
  return arrays
}

function fillArray (arrays, tableRows) {
  for (let i = 0, j = 0; i < tableRows.length; i++) {
    if (i % 7 === 0 && i !== 0) {
      j++
    }
    arrays[j].push(tableRows[i])
  }
  return arrays
}

function convertArrayToObject (arrays) {
  return arrays.map(array => {
    const [date, followersDelta, followers, followingDelta, following, postsDelta, posts] = array
    return {
      date: date.replace(/-/g, '/'),
      followersDelta: +followersDelta || 0,
      followers: +followers || 0,
      followingDelta: +followingDelta || 0,
      following: +following || 0,
      postsDelta: +postsDelta || 0,
      posts: +posts || 0
    }
  })
}

async function socialblade (username) {
  const html = await axios(`https://socialblade.com/twitter/user/${username}/monthly`)
  const $ = cheerio.load(html.data)
  const table = $('#socialblade-user-content > div:nth-child(5)').text()
  const tableRows = cleanRows(table.split('\n'))
  const itemsPerRow = 7
  let arrays = createArrayOfArrays(tableRows.length / itemsPerRow)
  arrays = fillArray(arrays, tableRows)
  const array2obj = convertArrayToObject(arrays)
  console.log(array2obj)
}

exports.socialblade = socialblade
