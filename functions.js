
const cheerio = require('cheerio');

const validSources = ['twitter', 'instagram', 'facebook', 'youtube'];

/**
 * Check if the source is valid
 * @param {string} source Social source
 * @return {boolean} returns if the source is valid
 */
function isValidSource(source) {
  return validSources.includes(source);
}

/**
 * Generate url for Socialblade from source and username
 * @param {string} source Social source
 * @param {string} username Social username
 * @return {string} generated URL for socialblade with source and username
 */
function generateUrl(source, username) {
  const userUrlCriteria = {
    facebook: 'page',
    youtube: 'channel',
  };
  const userUrl = userUrlCriteria[source] || 'user';
  const urlSuffix = source === 'facebook' ? '' : '/monthly';
  return `https://socialblade.com/${source}/${userUrl}/${username}${urlSuffix}`;
}

/**
 * Get table and charts data from Socialblade
 * @param {string} data html data from Socialblade
 * @param {string} source Social source
 * @return {object}
 */
function getOutput(data, source) {
  const $ = cheerio.load(data);
  // Table for Twitter, Instagram, Facebook, Youtube
  let table = $('#socialblade-user-content > div:nth-child(5)').text().split('\n');
  if (source === 'youtube') {
    // eslint-disable-next-line max-len
    table = $('#socialblade-user-content').text().split(/\s+ESTIMATED EARNINGS\n/)[1].split(/\s+Daily Averages /)[0].split('\n');
  }
  // Charts for Twitter, Instagram, Youtube
  let charts = [];
  if (source !== 'facebook') {
    charts = $('script').contents().get(5).data.split('\n');
  }
  return { table, charts };
}

// eslint-disable-next-line require-jsdoc
function cleanRows(table, charts) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const tableRows = table
      .map((row) => row.replace(/(\t|\s|,|\+)+/g, ''))
      .filter((row) => row && !days.includes(row));
  const chartsRows = charts
      .filter((item) => /^title: { text|^series:/g.test(item.trim()))
      .map((item) => item.trim().replace(/title: { text: |'|\\| },|series: | }],/g, ''))
      .map((item) => item.includes('[{ name:') ? item.split('data: ')[1] : item);
  return { tableRows, chartsRows };
}

/**
 * Create an array of arrays
 * @param {number} n length of array
 * @return {array} Array
 */
function createArrayOfArrays(n) {
  const arrays = [];
  for (let i = 0; i < n; i++) {
    arrays.push([]);
  }
  return arrays;
}

// eslint-disable-next-line require-jsdoc
function fillArray(arrays, tableRows, itemsPerRow) {
  for (let i = 0, j = 0; i < tableRows.length; i++) {
    if (i % itemsPerRow === 0 && i !== 0) {
      j++;
    }
    arrays[j].push(tableRows[i]);
  }
  return arrays;
}

// eslint-disable-next-line require-jsdoc
function convertArrayToObject(source, arrays) {
  return arrays.map((array) => {
    const [col1, col2, col3, col4, col5, col6, col7] = array;
    let parsed;
    switch (source) {
      case 'twitter':
      case 'instagram':
        return {
          date: getDate(col1),
          followersDelta: +col2 || 0,
          followers: +col3 || 0,
          followingDelta: +col4 || 0,
          following: +col5 || 0,
          postsDelta: +col6 || 0,
          posts: +col7 || 0,
        };
      case 'facebook':
        return {
          date: getDate(col1),
          likesDelta: +col2 || 0,
          likes: +col3 || 0,
          talkingAboutDelta: +col4 || 0,
          talkingAbout: +col5 || 0,
        };
      case 'youtube':
        return {
          date: getDate(col1),
          subscribersDelta: +(convertUnit(col2)) || 0,
          subscribers: +(convertUnit(col3)) || 0,
          viewsDelta: +col4 || 0,
          views: +col5 || 0,
        };
      case 'charts':
      default:
        parsed = JSON.parse(col2);
        // [[Timestamp, Number], [...], ...]
        parsed = (parsed || []).map((item) => ({ date: getDate(item[0]), value: item[1] }));
        return {
          id: generateId(col1),
          title: col1,
          data: parsed,
        };
    }
  });
}

// eslint-disable-next-line require-jsdoc
function getDate(str) {
  return new Date(str).toISOString().split('T')[0].replace(/-/g, '/');
}

// eslint-disable-next-line require-jsdoc
function generateId(str) {
  const splitted = str.split(/ for |\(/);
  return `${splitted[2] || ''.slice(0, -1)}${splitted[0]}`
      .toLowerCase()
      .replace(/\s|\)/g, '-');
}

// eslint-disable-next-line require-jsdoc
function convertUnit(str) {
  return str.replace('K', '000').replace('M', '000000');
}

module.exports = {
  validSources,
  generateUrl,
  isValidSource,
  getOutput,
  cleanRows,
  createArrayOfArrays,
  fillArray,
  convertArrayToObject,
};
