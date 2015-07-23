var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var rp = require('request-promise');
var path = require('path');
var _ = require('lodash');
var url = require('url');

rp('https://watsi.org/fund-treatments.json').then(function (profilesString) {
  console.log('downloaded profiles');
  var profiles = JSON.parse(profilesString);
  return Promise.all([
    Promise.map(profiles.profiles, function (profile) {
      var profileURL = url.parse(profile.url);
      var profilePath = path.parse(profileURL.pathname);
      return rp(profile.url + '.json')
        .then(function (profileString) {
          console.log('downloaded profile:', profilePath.base);
          return fs.writeFileAsync(path.join(__dirname, '../json/profiles/' + profilePath.base + '.json'), profileString);
        });
    }),
    fs.writeFileAsync(path.join(__dirname, '../json/profiles.json'), profilesString)
  ]);
});
