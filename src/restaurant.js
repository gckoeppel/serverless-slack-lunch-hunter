'use strict';

const rp = require('request-promise-native');
const client = require('./clients/eurest');

class Restaurant {
  constructor(name, url, parser, client, id, color, image) {
    this.name = name;
    this.url = url;
    this.color = color;
    if(client) {
      this.client = require(client);
      this.id = id;
    } else if(parser) {
      this.parser = require(parser);
    }
    if(image) {
      this.image = image
    }
  }

  getTodaysOffers() {
    let fetchOffers;
    if(this.client) {
      fetchOffers = this.client.request(this.id).then(offers => {
        this.offers = offers;
        return this;
      });
    } else {
      fetchOffers = rp(this.url).then(body => {
        this.offers = this.parser.parse(body);
        return this;
      })
    }
    return fetchOffers.catch(error => {
      console.error(error);
      this.offers = [];
      return this;
    });
  }
}

module.exports = Restaurant;
