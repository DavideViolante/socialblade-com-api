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
 * @return {string} Content of the page
 */
async function callSocialblade(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // eslint-disable-next-line max-len
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36');
  await page.goto(url);
  const content = await page.content();
  await browser.close();
  return content;
}

/**
 * Return data from Socialblade
 * @param {string} source The social source. Valid inputs: twitter, instagram, facebook, youtube
 * @param {string} username The social username
 * @return {object} data from Socialblade
 */
async function socialblade(source, username) {
  try {
    if (!isValidSource(source)) {
      throw Error(`Invalid source. Valid sources are: ${validSources.join(', ')}`);
    }
    const url = generateUrl(source, username);
    const html = await callSocialblade(url);
    const { table, charts } = getOutput(html, source);
    const { tableRows, chartsRows } = cleanRows(table, charts);
    const itemsPerRow = { twitter: 7, instagram: 7, facebook: 5, youtube: 6 };
    let tableArrays = createArrayOfArrays(tableRows.length / itemsPerRow[source]);
    tableArrays = fillArray(tableArrays, tableRows, itemsPerRow[source]);
    const tableArrayOfObjects = convertArrayToObject(source, tableArrays);
    let chartsArrays = createArrayOfArrays(chartsRows.length / 2);
    chartsArrays = fillArray(chartsArrays, chartsRows, 2);
    const chartsArrayOfObjects = convertArrayToObject('charts', chartsArrays);
    return { table: tableArrayOfObjects, charts: chartsArrayOfObjects };
  } catch (err) {
    console.log(err.message);
  }
}

exports.socialblade = socialblade;
