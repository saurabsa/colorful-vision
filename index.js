/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const glob = require('glob');
const sanitize = require("sanitize-filename");
const port = process.env.PORT || 1337;
const app = express();
var server;

const audioFiles = glob.sync('./data/instructions/**/*.txt');
var db = {};

function initialize() {
  audioFiles.forEach((audioFile) => {
    if (fs.existsSync(audioFile)) {
      db[audioFile] = fs.readFileSync(audioFile);
    }
  });
  return Promise.resolve(db);
}

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json({ strict: false })); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.send('Welcome to colorful-vision-express');
});

// serve swagger
app.post('/getAudio', function (req, res) {
  let body = req.body;
  console.log('>>>>>>>>>>>');
  console.log(req.body);
  let receivedText = sanitize(body.text);
  let searchKey = `./data/instructions/${receivedText}.txt`;
  console.log('searchKey');
  console.log(searchKey);
  let result = db[searchKey];
  //let result = fs.readFileSync('/Users/amarz/play/tts-node/data/instructions/Tutorial House line.txt');
  console.log(typeof result);
  console.log(Buffer.isBuffer(result));
  res.setHeader('Content-Type', 'application/ssml+xml');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(result);
});

console.log('Initializing the server takes about 30 seconds. Please be patient :-).');
initialize().then(() => {
  console.log(Object.keys(db).length);
  console.log(Object.keys(db));
  console.log('Server initialized.');
  server = app.listen(port, () => {
    let host = server.address().address;
    let port = server.address().port;

    console.log(`colorful vision express app listening at http://${host}:${port}`);
    return server;
  });
});