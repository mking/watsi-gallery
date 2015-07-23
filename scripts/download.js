var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var rp = require('request-promise');
var path = require('path');
var _ = require('lodash');
var url = require('url');

rp('https://watsi.org/fund-treatments.json').then(function (profilesString) {
  console.log('downloaded profiles');
  var profileObj = JSON.parse(profilesString);

  // Rewrite Watsi urls to local urls
  var profiles = _(profileObj.profiles).map(function (profile) {
    var profileURL = url.parse(profile.url);
    var profilePath = path.parse(profileURL.pathname);
    var imageURL = url.parse(profile.profile_url);
    var imagePath = path.parse(imageURL.pathname);
    return _(profile).extend({
      url_file: profilePath.base,
      profile_url_file: imagePath.base
    }).value();
  }).value();

  return Promise.all([
    Promise.map(profiles, function (profile) {
      return Promise.all([
        // Download profile json
        rp(profile.url + '.json').then(function (profileString) {
          console.log('downloaded profile:', profile.url_file);
          return fs.writeFileAsync(path.join(__dirname, '../json/profiles/' + profile.url_file + '.json'), profileString);
        }),

        // Download profile image
        rp({
          url: profile.profile_url,
          encoding: null
        }).then(function (image) {
          console.log('downloaded image:', profile.profile_url_file);
          return fs.writeFileAsync(path.join(__dirname, '../img/profiles/' + profile.profile_url_file), image);
        })
      ]);
    }),
    fs.writeFileAsync(path.join(__dirname, '../json/profiles.json'), JSON.stringify(profiles))
  ]);
});
