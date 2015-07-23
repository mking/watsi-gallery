// Simulate database with JSON files
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var _ = require('lodash');

function getProfiles() {
  return fs.readFileAsync(path.join(__dirname, '../json/profiles.json')).then(function (profileString) {
    return JSON.parse(profileString);
  }).map(function (profile) {
    return fs.readFileAsync(path.join(__dirname, '../json/profiles/' + profile.url_file + '.json')).then(function (profileString) {
      var profileObj = JSON.parse(profileString);
      return _(profile).extend(profileObj).value();
    });
  });
}

module.exports = {
  getProfiles: getProfiles
};
