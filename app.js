require('dotenv').config();
var express = require('express');
var cors = require('cors');
var cookieParser = require('cookie-parser');

var deleteSongsList = require('./routes/delete-liked-songs-list.js');
var callback = require('./routes/spotify-callback.js');

var app = express();
app.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser());
app.use('/delete-liked-songs-list', deleteSongsList);
app.use('/callback', callback);
app.listen(8888);
