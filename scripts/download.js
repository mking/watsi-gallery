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
      var imageURL = url.parse(profile.profile_url);
      var imagePath = path.parse(imageURL.pathname);
      return Promise.all([
        rp(profile.url + '.json').then(function (profileString) {
          console.log('downloaded profile:', profilePath.base);
          return fs.writeFileAsync(path.join(__dirname, '../json/profiles/' + profilePath.base + '.json'), profileString);
        }),
        rp({
          url: profile.profile_url,
          encoding: null
        }).then(function (image) {
          console.log('downloaded image:', imagePath.base, Buffer.isBuffer(image));
          return fs.writeFileAsync(path.join(__dirname, '../img/profiles/' + imagePath.base), image);
        })
      ]);
    }),
    fs.writeFileAsync(path.join(__dirname, '../json/profiles.json'), profilesString)
  ]);
});
