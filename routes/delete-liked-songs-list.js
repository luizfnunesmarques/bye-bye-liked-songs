var express = require('express');
var router = express.Router();
var spotifyWebApi = require('spotify-web-api-node');

router.get('/', function(req, res) {
  const spotifyApi = new spotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID
  });

  const scopes = ['user-library-read, user-library-modify']
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, '');
  res.redirect(authorizeURL)
});

module.exports = router;