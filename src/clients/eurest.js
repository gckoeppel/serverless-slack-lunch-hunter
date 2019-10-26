'use strict';

const btoa = require('btoa');
const rp = require('request-promise-native');
const baseURL = 'https://clients.eurest.ch/api/Menu/';

module.exports = {
  name: 'Eurest',
  /**
   * requests today's menu offers from `clients.eurest.ch` API
   * @param outletId id of outlet to request menu offers from
   * @return array of offers
   */
  request: function (outletId) {
    let today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    let query = [
      '100-0',
      '+MenuDate1+MenuOrder1',
      [
        'ID',
        'MenuDate1',
        'MenuIngredients1',
        'MenuIngredients2',
        'MenuIngredients3',
        'MenuIngredients4',
        'MenuPricePrefix1',
        'MenuPrice1',
        'MenuPrice2',
        'MenuPrice3',
        'MenuPrice4',
        'MenuPriceDescription1',
        'MenuPriceDescription2',
        'MenuPriceDescription3',
        'MenuPriceDescription4',
        'Menuline',
        'MenuDeclaration',
        '_LanguageConfig',
        'Outlet.ID'
      ].join('&'),
      `MenuDate1=eq:{{${today}}}&Outlet=eq:{{${outletId}}}`
    ].join('/');
    let encodedQuery = btoa(encodeURIComponent(query));
    return rp({ url: baseURL + encodedQuery, json: true }).then(response => {
      return response.data.map(offer => (
        {
          'title': prepareTitle(offer),
          'description': prepareDescription(offer)
        }
      ));
    })
  }
}

function prepareTitle(offer) {
  return offer.Menuline.MenulineKey1;
}

function prepareDescription(offer) {
  let description = '';
  [
    'MenuIngredients1',
    'MenuIngredients2',
    'MenuIngredients3',
    'MenuIngredients4',
  ].forEach(key => {
    if(offer[key]) {
      description += JSON.parse(offer[key]).DE + '\n';
    }
  })
  if(offer.MenuPrice2) {
    description += '_CHF ' + offer.MenuPrice2.toFixed(2) + '_';
  } else {
    description += '_CHF ' + offer.MenuPrice1.toFixed(2) + '_';
  }
  return description;
}