'use strict';
const $ = require('cheerio');
const utils = require('./utils');

module.exports = {
  name: 'Eurest',
  /**
   * parses menu offers from sv-restaurant webpages
   * @param html html body of webpage
   * @return array of offers
   */
  parse: function(html) {
    let offers = $.load(html)('.menu-section').toArray();

    return offers.map(offer => (
      {
        'title'       : prepareTitle(offer),
        'description' : prepareDescription(offer)
      }
    ));
  }
}

function prepareTitle(offer) {
  let weekDay = new Date().getDay();
  return utils.removeWhitespace($(offer).find(`.day:nth-child(${weekDay}) .meal h3`).text());
}

function prepareDescription(offer) {
  let weekDay = new Date().getDay();
  let dayOffer = $(offer).find(`.day:nth-child(${weekDay}) .meal`);
  let description = [
    $(dayOffer).find('.meal-description p').text(),
    $(dayOffer).find('.prices div').map((i, el) => {
      return '_' + utils.removeWhitespace($(el).text()) + '_';
    }).get().join('\n')
  ].join('\n');
  return description;
}
