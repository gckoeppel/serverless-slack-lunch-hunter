'use strict';
require('./src/lunchhunter').run()
  .then(result => { console.log(result.message); })
  .catch(err => { console.log(err); });
