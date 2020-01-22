var express = require('express');
var request = require('request');
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var clientId = 'clientid';
var clientSecret = 'secret';
var redirectUri = 'callback';
var spotifyWebApi = require('spotify-web-api-node');

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/delete-liked-songs-list', function(req, res) {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const spotifyApi = new spotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId
  });

  const scopes = ['user-library-modify']
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  res.redirect(authorizeURL)
});

app.get('/callback', function(req, res) {
  const credentials = {
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: redirectUri
  };

  const spotifyApi = new spotifyWebApi(credentials);
  spotifyApi.authorizationCodeGrant(code).then(
    function(data) {
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
      return spotifyApi
    },
    function(err) {
      res.redirect('/#');
    }
  ).then(
    function(api){
      api.removeFromMySavedTracks(["01jIO8SJFnpSiNLH1JaBZ5"])
      .then(function(data) {
        console.log('Removed!');
        res.redirect('/#');
      }, function(err) {
        res.redirect('/#');
      }
    );
  })
});

app.listen(8888);
