'use strict';

// load .env variables if set
require('dotenv').config();

const config = require('config');
const rp = require('request-promise-native');

module.exports.notify = function(promises) {

  let content = createContentFrom(promises),
    completeWebhook = process.env.TEAMS.concat(process.env.TEAMS_WEBHOOK),
    options = {
      method: 'POST',
      uri: completeWebhook,
      body: content,
      json: true
    };

  return rp(options)
    .then(function(body) {
      return { message: 'Teams message sent' };
    })
    .catch(function(error) {
      console.log(error.message);
      throw error;
    });
};

function createContentFrom(promises) {
    
  return {
	'type': 'MessageCard',
    '@context': 'http://schema.org/extensions',
    'summary': 'Todays menus!',
    'sections': promises.map(restaurant => (
      restaurant.Type == "Restaurant" ? 
      {
        'startGroup': true,
        'activityTitle': '['.concat(restaurant.name, '](', restaurant.url, ')'),
        'activitySubtitle': '',
        'activityImage': restaurant.image,
        'text'    : restaurant.offers.length > 0 ? restaurant.offers.map(offer => 
          {
            var txt = '\n- **'
            return txt.concat(offer.title, '** ', offer.description.replace(new RegExp('\n', 'g'), ' '))
          }
        ).join('') : 
            'Unfortunately no menu available'
      } : 
      restaurant.TruckList.map( truck => (
      { 
        'startGroup': true,
        'activityTitle': truck.name,
        'activitySubtitle': '['.concat(truck.locationReadable, '](', truck.gmapslink, ')'),
        'activityText': truck.date,
        'activityImage': truck.logo,
        'text': truck.description,
      }))
    )).flat()
  };
}

// Array.flat() is not yet implemented everywhere, so we need our own .flat function
// Source: https://stackoverflow.com/questions/50993498/flat-is-not-a-function-whats-wrong
// Author: Ivan https://stackoverflow.com/users/6331369/ivan
Object.defineProperty(Array.prototype, 'flat', {
    value: function(depth = 1) {
      return this.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
      }, []);
    }
});
