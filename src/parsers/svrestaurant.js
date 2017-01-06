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
    let offers = $.load(html)('.offer').toArray();

    return offers.map(offer => (
      {
        'title'       : prepareTitle(offer),
        'description' : prepareDescription(offer)
      }
    ));
  }
}

function prepareTitle(offer) {
  return utils.removeWhitespace($(offer).find('.offer-description').text());
}

function prepareDescription(offer) {
  return utils.removeWhitespace(
    $(offer).find('.maindish .title').text()) + ' \u2014 '
    + utils.removeWhitespace($(offer).find('.maindish .trimmings').text()).replace(/\sMit/, '\nMit') + '\n'
    + '_' + $(offer).find('.price').text() + '_';
}

