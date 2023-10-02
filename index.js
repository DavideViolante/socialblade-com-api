const puppeteer = require('puppeteer');

const {
  getOutput,
  cleanRows,
  createArrayOfArrays,
  convertArrayToObject,
  fillArray,
  generateUrl,
  isValidSource,
  validSources,
} = require('./functions');

/**
 * Get content from a Socialblade page
 * @param {string} url The URL of Socialblade page
 * @param {string} [cookieValue] Your Socialblade cookie, needed for Instagram
 * @return {string} Content of the page
 */
async function callSocialblade(url, cookieValue = '') {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  // eslint-disable-next-line max-len
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36');
  const cookie = {
    domain: '.socialblade.com',
    name: 'PHPSESSXX',
    value: cookieValue,
  };
  await page.setCookie(cookie);
  await page.goto(url);
  // Youtube has some redirects, we need to go always monthly page
  const currentUrl = page.url();
  if (!currentUrl.includes('/monthly') && currentUrl.includes('youtube')) {
    await page.goto(`${currentUrl}/monthly`);
  }
  const content = await page.content();
  await browser.close();
  return content;
}

/**
 * Return data from Socialblade
 * @param {string} source The social source. Valid inputs: twitter, instagram, facebook, youtube
 * @param {string} username The social username
 * @param {string} [cookie] Your Socialblade cookie, needed for Instagram
 * @return {object} data from Socialblade
 */
async function socialblade(source, username, cookie = '') {
  try {
    if (!isValidSource(source)) {
      throw Error(`Invalid source. Valid sources are: ${validSources.join(', ')}`);
    }
    if (source === 'instagram' && !cookie) {
      throw Error(`The cookie param is needed for ${source}, see Readme for more info`);
    }
    const url = generateUrl(source, username);
    const html = await callSocialblade(url, cookie);
    const { table, charts } = getOutput(html, source);
    const { tableRows, chartsRows } = cleanRows(table, charts);
    const itemsPerRow = { twitter: 7, instagram: 7, facebook: 5, youtube: 6, tiktok: 9 };
    let tableArrays = createArrayOfArrays(tableRows.length / itemsPerRow[source]);
    tableArrays = fillArray(tableArrays, tableRows, itemsPerRow[source]);
    const tableArrayOfObjects = convertArrayToObject(source, tableArrays);
    let chartsArrays = createArrayOfArrays(chartsRows.length / 2);
    chartsArrays = fillArray(chartsArrays, chartsRows, 2);
    const chartsArrayOfObjects = convertArrayToObject('charts', chartsArrays);
    // console.log(tableArrayOfObjects, chartsArrayOfObjects);
    return { table: tableArrayOfObjects, charts: chartsArrayOfObjects };
  } catch (err) {
    console.log(err.message);
  }
}

// socialblade('youtube', 'selenagomez', 'asd123');

exports.socialblade = socialblade;
