const validSources = ['twitter', 'instagram', 'facebook'/* , 'youtube' */]

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

function convertArrayToObject (source, arrays) {
  return arrays.map(array => {
    const [col1, col2, col3, col4, col5, col6, col7] = array
    switch (source) {
      case 'twitter':
      case 'instagram':
        return {
          date: dateDashToSlash(col1),
          followersDelta: +col2 || 0,
          followers: +col3 || 0,
          followingDelta: +col4 || 0,
          following: +col5 || 0,
          postsDelta: +col6 || 0,
          posts: +col7 || 0
        }
      case 'facebook':
        return {
          date: dateDashToSlash(col1),
          likesDelta: +col2 || 0,
          likes: +col3 || 0,
          talkingAboutDelta: +col4 || 0,
          talkingAbout: +col5 || 0
        }
      case 'youtube':
        return {
          date: dateDashToSlash(col1),
          subscribersDelta: +(convertUnit(col2)) || 0,
          subscribers: +(convertUnit(col3)) || 0,
          viewsDelta: +col4 || 0,
          views: +col5 || 0
        }
    }
  })
}

function convertUnit (str) {
  return str.replace('K', '000').replace('M', '000000')
}

function dateDashToSlash (str) {
  return str.replace(/-/g, '/')
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
