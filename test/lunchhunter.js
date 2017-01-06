'use strict';

const chai            = require('chai'),
      chaiAsPromised  = require('chai-as-promised'),
      nock = require('nock'),
      dotenv = require('dotenv').config();
 
chai.use(chaiAsPromised);
chai.should();

const LunchHunter = require('../src/lunchhunter');
let slack = nock(process.env.SLACK)
  .post(process.env.WEBHOOK)
  .reply(200, 'ok');

describe('LunchHunter', function() {
  it('should run', function() {
    let promise = LunchHunter.run();
    return promise.should.become({ message: 'Slack message sent' });
  })
});
