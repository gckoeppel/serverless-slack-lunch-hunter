'use strict';

const chai            = require('chai'),
      chaiAsPromised  = require('chai-as-promised');
 
chai.use(chaiAsPromised);
chai.should();

const Restaurant = require('../src/restaurant.js');

describe('Restaurant', function() {
  let restaurant = new Restaurant(
    'name',
    'http://swisscom-binz.sv-restaurant.ch/de.html',
    'color',
    './parsers/svrestaurant');
  describe('that is created', function() {
    it('should have a name', function() {
      restaurant.should.have.property('name');
    }),
    it('should have a url', function() {
      restaurant.should.have.property('url');
    }),
    it('should have a color', function() {
      restaurant.should.have.property('color');
    }),
    it('should have a parser', function() {
      restaurant.should.have.property('parser');
    }),
    it('shouldn\'t have any offers yet', function() {
      restaurant.should.not.have.property('offers');
    });
  }),
  describe('after getting today\'s offers', function() {
    it('should have offers now', function() {
      return restaurant.getTodaysOffers().should.eventually.have.property('offers');
    });
  });
});
