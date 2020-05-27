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

function fillArray (arrays, tableRows, itemsPerRow) {
  for (let i = 0, j = 0; i < tableRows.length; i++) {
    if (i % itemsPerRow === 0 && i !== 0) {
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

module.exports = {
  cleanRows,
  createArrayOfArrays,
  fillArray,
  convertArrayToObject
}
