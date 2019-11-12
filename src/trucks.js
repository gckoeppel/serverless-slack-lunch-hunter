'use strict';
const $ = require('cheerio');

const rp = require('request-promise-native');

class Truck {
  constructor(date, name, description, locationReadable, gmapslink, logo) {
    this.date = date;
    this.name = name;
    this.description = description;
    this.locationReadable = locationReadable;
    this.gmapslink = gmapslink;
    this.logo = logo;
  }
}

class Trucks {
  constructor(url, lat, lon, distance) {
    this.url = url;
    this.lat = lat;
    this.lon = lon;
    this.distance = distance;
    this.TruckList = [];
    this.Type = "Trucks"
  }

  getTodaysOffers() {
    let fetchOffers;
    fetchOffers = rp(this.url).then(body => {
      // get truck logo and info
      let foodtruckLogo = $.load(body)('.tourData .foodtruckLogo').toArray()
      let foodtruckInfo = $.load(body)('.tourData .foodtruckInfo').toArray()

      // loop over info and create list of interesting trucks
      for (var i = 0; i < foodtruckInfo.length; i++)
      {
        // get all data
        let date = $(foodtruckInfo[i]).find('.date strong').text()
        let name = $(foodtruckInfo[i]).find('.truck strong').text()
        let description = $(foodtruckInfo[i]).find('.truck').text().replace(name.concat(', '), '')
        let locationReadable = $(foodtruckInfo[i]).find('.location').text()
        let gmapslink = $(foodtruckInfo[i]).find('.location a:first-child')[0].attribs['href']
        let logo = $(foodtruckLogo[i]).find('img')[0].attribs['src']
        
        // determine if it is interesting: check date and range
        if(date.includes('Heute'))
        {
          var regex = new RegExp('@(.*),(.*),');
          var lon_lat = gmapslink.match(regex);
          var lon = lon_lat[1];
          var lat = lon_lat[2];
          var dist = CalculateDistance(lat, lon, this.lat, this.lon)
          if(dist < this.distance)
          {
            this.TruckList.push(new Truck(date, name, description, locationReadable, gmapslink, logo));
          }
        }
      }
      return this;
    })
    return fetchOffers.catch(error => {
      console.error(error);
      this.offers = [];
      return this;
    });
      
  }
}

function DegToRad(degrees){
  return degrees * Math.PI / 180;
}

function CalculateDistance(lat1, lng1, lat2, lng2){
  let R = 6378137;
  let dLat = DegToRad(lat2 - lat1);
  let dLong = DegToRad(lng2 - lng1);
  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(DegToRad(lat1)) * 
          Math.cos(DegToRad(lat1)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let distance = R * c;
  return distance;
}

module.exports = Trucks;
