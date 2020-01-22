var express = require('express');
var router = express.Router();
var spotifyWebApi = require('spotify-web-api-node');
var clientId = 'ommited';
var redirectUri = 'http://localhost:8888/callback';

router.get('/', function(req, res) {
  const spotifyApi = new spotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId
  });

  const scopes = ['user-library-read, user-library-modify']
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, '');
  res.redirect(authorizeURL)
});

module.exports = router;