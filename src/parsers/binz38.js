'use strict';
const $ = require('cheerio');
const entities= new (require('html-entities').AllHtmlEntities)();
const utils = require('./utils');

module.exports = {
  name: 'Binz 38',
  /**
   * parses menu offers from binz38 webpage
   * @param html html body of webpage
   * @return array of offers
   */
  parse: function(html) {
    let results = [];
    // get the menu items from very unsemantically formatted html
    let offers = entities.decode(
      utils.removeWhitespace(
        $.load(html)('.showcase_text').eq(0).html()
      )
    );
    // regex to the rescue!
    let regex = /([^<>\/]*)(<br>|<b>){1,}(\d*\.\d*)/g;
    let match = regex.exec(offers)
    let counter = 1;
    while (match != null) {
      // matched text: match[0]
      // capturing group n: match[n]
      results.push(
        {
          title      : 'Menu ' + counter++,
          description: `${match[1]}\n_CHF ${match[3]}_`
        }
      );
      match = regex.exec(offers)
    }
    return results;
  }
}
