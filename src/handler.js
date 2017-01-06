'use strict';
// set correct config dir path when run as AWS Lambda Task
if(process.env['LAMBDA_TASK_ROOT']) {
  process.env.NODE_CONFIG_DIR='/var/task/config';
}
const LunchHunter = require('./lunchhunter');

module.exports.notify = function(event, context, cb) {
  LunchHunter.run()
    .then(result => cb(null, result))
    .catch(err => cb(true, err));
};
