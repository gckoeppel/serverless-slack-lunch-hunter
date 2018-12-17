'use strict';
const $ = require('cheerio');
const utils = require('./utils');

module.exports = {
  name: 'SV Restaurant',
  /**
   * parses menu offers from sv-restaurant webpages
   * @param html html body of webpage
   * @return array of offers
   */
  parse: function(html) {
    let offers = $.load(html)('#menu-plan-tab1 .menu-item').toArray();

    return offers.map(offer => (
      {
        'title'       : prepareTitle(offer),
        'description' : prepareDescription(offer)
      }
    ));
  }
}

function prepareTitle(offer) {
  return utils.removeWhitespace($(offer).find('.menu-title').text());
}

function prepareDescription(offer) {
  return $(offer).find('.menu-description').text() + '\n' +
    '_' + utils.removeWhitespace($(offer).find('.price').text()) + '_';
}

