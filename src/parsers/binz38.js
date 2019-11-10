'use strict';
const $ = require('cheerio');
const utils = require('./utils');

module.exports = {
  name: 'Binz 38',
  /**
   * parses menu offers from binz38 webpage
   * @param html html body of webpage
   * @return array of offers
   */
  parse: function(html) {

    // find out the magic button string of today
    let magic = ""
    let today = new Date().getDate().toString()
    // for debugging weekends: set date to a weekday
    //let today = 11
    let buttons = $.load(html)('button').toArray();
    for (var i = 0; i < buttons.length; i++)
    {
      if (buttons[i].firstChild.data.includes(today))
      {
        magic = buttons[i].attribs["data-tabular"]
      }
    }
    console.log(magic)

    let offers = $.load(html)(`.tabular__content .container [data-tabular=${magic}] .paragraph`).toArray()
    
    return offers.map(offer => (
      {
        'title'       : prepareTitle(offer),
        'description' : prepareDescription(offer)
      }
    ));
  }
}

function prepareTitle(offer) {
  return utils.removeWhitespace($(offer).find('font:first-child').text());
}

function prepareDescription(offer) {
  $(offer).find('strong').append(' ')
  return utils.removeWhitespace($(offer).find('font:not(:first-child)').append(' ').text());
}

