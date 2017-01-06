'use strict';
const $ = require('cheerio');
const utils = require('./utils');
const entities= new (require('html-entities').AllHtmlEntities)();

module.exports = {
  name: 'ZFV',
  /**
   * parses menu offers from zfv webpages
   * @param html html body of webpage
   * @return array of offers
   */
  parse: function(html) {
    let today = new Date().toISOString().replace(/T.*/, ''),
        offers = $.load(html)(`table.menu tr[data-date=${today}]`).toArray();

    return offers.map(offer => (
      {
        'title'       : prepareTitle(offer),
        'description' : prepareDescription(offer)
      }
    ));
  }
}

function prepareTitle(offer) {
  return utils.removeWhitespace($(offer).find('td:first-child').text())
}

function prepareDescription(offer) {
  return entities.decode(
    utils.removeWhitespace(
      $(offer).find('td:last-child').html()
    )
    .replace(/(Fleisch|Fisch): \w+.*<br>/, '') // remove provenance for the sake of brevity
    .replace(/CHF.*/g, '\_$&\_')               // make price italic
    .replace(/\s+/g, ' ')                      // remove extra white space
    .replace(/\s*(<br>)+\s*/g, '\n')           // replace <br> with newline
  );
}
