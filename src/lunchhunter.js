'use strict';
const config = require('config');
const Restaurant = require('./restaurant');
const slack = require('./slack');
const teams = require('./teams');

class LunchHunter {
  run() {
    // instantiate restaurants from config
    let restaurants = config.get('restaurants').map(
      config => new Restaurant(config.name, config.url, config.parser, config.client, config.id, config.color, config.image)
    );

    // fetch today's offers for all restaurants
    const promises = restaurants.map(restaurant => restaurant.getTodaysOffers());

    // post to slack if configured
    if(config.has('slack')) {
      // trigger slack post when all offers received
      return Promise.all(promises)
        .then(function(restaurants) {
          return slack.notify(restaurants)
        })
        .catch(function(error) {
          //TODO: handle failure of single offer request
          throw error;
        });
    }
    
    if(config.has('teams')) {
      // trigger slack post when all offers received
      return Promise.all(promises)
        .then(function(restaurants) {
          return teams.notify(restaurants)
        })
        .catch(function(error) {
          //TODO: handle failure of single offer request
          throw error;
        });
    }
    
  }
}

module.exports = new LunchHunter();
