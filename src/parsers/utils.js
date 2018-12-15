'use strict';

String.prototype.replaceAll = function (search, replacement) {
  let target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

module.exports.removeWhitespace = function(string) {
  return string
    .replaceAll('\r', '')
    .replaceAll('\n', ' ')
    .replaceAll('\t', '')
    .replaceAll('\\s+', ' ')
    .trim();
}
