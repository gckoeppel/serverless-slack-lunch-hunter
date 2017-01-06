'use strict';

const rp = require('request-promise-native');

class Restaurant {
  constructor(name, url, color, parser) {
    this.name = name;
    this.url = url;
    this.color = color;
    this.parser = require(parser);
  }

  getTodaysOffers() {
    return rp(this.url).then(body => {
      this.offers = this.parser.parse(body);
      return this;
    });
  }
}

module.exports = Restaurant;
