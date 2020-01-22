var express = require('express');
var router = express.Router();
var spotifyWebApi = require('spotify-web-api-node');
var clientId = 'ommited';
var redirectUri = 'http://localhost:8888/callback';
var clientSecret = 'ommited';

var retrieveTrack = function(tracks) {
  const removeList = [];
  for (let track of tracks) {
    const id = track["track"]["id"]
    removeList.push(id)
  };
  return removeList
};

router.get('/', function(req, res) {
  const code = req.query.code || null;

  const credentials = {
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: redirectUri
  };

  const spotifyApi = new spotifyWebApi(credentials);

  spotifyApi.authorizationCodeGrant(code)
    .then(
      function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
        spotifyApi.getMySavedTracks({
          limit : 10,
          offset: 0
        })
        .then(
          function(data) {
            const trackIds = retrieveTrack(data["body"]["items"]);
            console.log(trackIds);
            spotifyApi.removeFromMySavedTracks(trackIds)
              .then(
                function(data) {
                console.log('Removed!');
              }, function(err) {
                console.log('Something went wrong!', err);
              });
          },
        function(err) {
          console.log('Something went wrong!', err);
        });
      },
    function(err) {
      res.redirect('/#');
    }
  )
});

module.exports = router;