'use strict';
const config = require('config');
const Restaurant = require('./restaurant');
const slack = require('./slack');
const teams = require('./teams');
const Trucks = require('./trucks');

class LunchHunter {
  run() {
    // instantiate restaurants from config
    let restaurants = config.get('restaurants').map(
      config => new Restaurant(config.name, config.url, config.parser, config.client, config.id, config.color, config.image)
    );
    
    let promises
    if(config.has('trucks')) {
      let trucks = new Trucks(config.get('trucks.url'), config.get('trucks.center_lat'), config.get('trucks.center_lon'), config.get('trucks.distance'));
      // fetch today's offers for all restaurants
      promises = restaurants.map(restaurant => restaurant.getTodaysOffers()).concat(trucks.getTodaysOffers());
    } else {
      promises = restaurants.map(restaurant => restaurant.getTodaysOffers());
    }

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
      // trigger teams post when all offers received
      return Promise.all(promises)
        .then(function(prom) {
          return teams.notify(prom)
        })
        .catch(function(error) {
          //TODO: handle failure of single offer request
          throw error;
        });
    }
    
  }
}

module.exports = new LunchHunter();
