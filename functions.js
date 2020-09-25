const validSources = ['twitter', 'instagram', 'facebook'/*, 'youtube' */]

function isValidSource (source) {
  return validSources.includes(source)
}

function generateUrl (urlPrefix, source, username) {
  const userUrl = source === 'facebook' ? 'page' : 'user'
  const urlSuffix = source === 'facebook' ? '' : '/monthly'
  return `${urlPrefix}https://socialblade.com/${source}/${userUrl}/${username}${urlSuffix}`
}

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
    if (array.length === 5) { // Facebook
      const [date, likesDelta, likes, talkingAboutDelta, talkingAbout] = array
      return {
        date: date.replace(/-/g, '/'),
        likesDelta: +likesDelta || 0,
        likes: +likes || 0,
        talkingAboutDelta: +talkingAboutDelta || 0,
        talkingAbout: +talkingAbout || 0
      }
    } else {
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
    }
  })
}

module.exports = {
  validSources,
  generateUrl,
  isValidSource,
  cleanRows,
  createArrayOfArrays,
  fillArray,
  convertArrayToObject
}
