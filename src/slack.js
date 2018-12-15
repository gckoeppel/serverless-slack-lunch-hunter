'use strict';

// load .env variables if set
require('dotenv').config();

const config = require('config');
const rp = require('request-promise-native');

module.exports.notify = function(restaurants) {

  let content = createContentFrom(restaurants),
      completeWebhook = process.env.SLACK.concat(process.env.WEBHOOK),
      options = {
        method: 'POST',
        uri: completeWebhook,
        form: { 
          payload: JSON.stringify(content)
        }
      };

  return rp(options)
    .then(function(body) {
      return { message: 'Slack message sent' };
    })
    .catch(function(error) {
      console.log(error.message);
      throw error;
    });
};

function createContentFrom(restaurants) {
  return {
    'channel'    : config.has('slack.channel') ? config.get('slack.channel') : undefined,
    'username'   : config.get('slack.username'),
    'icon_emoji' : config.get('slack.icon_emoji'),
    'attachments': restaurants.map(restaurant => (
      {
        'title'     : restaurant.name,
        'title_link': restaurant.url,
        'fallback'  : config.get('slack.fallback'),
        'color'     : restaurant.color,
        'mrkdwn_in' : ['text', 'pretext', 'fields'],
        'fields'    : restaurant.offers.map(offer => (
          {
            'title' : offer.title,
            'value' : offer.description,
            'short' : true,
          }
        )),
        'footer': restaurant.parser.name,
        'ts': Math.round((new Date).getTime() / 1000)
      }
    ))
  };
}

