/**
Copyright (c) Microsoft Corporation
All rights reserved. 
MIT License
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ""Software""), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/

var access_token;
function Synthesize(text) {

  // Note: The way to get api key:
  // Free: https://www.microsoft.com/cognitive-services/en-us/subscriptions?productId=/products/Bing.Speech.Preview
  // Paid: https://portal.azure.com/#create/Microsoft.CognitiveServices/apitype/Bing.Speech/pricingtier/S0
  var post_speaker_data = `<?xml version="1.0"?><speak version="1.0" xml:lang="en-us"><voice xml:lang="en-us" xml:gender="Female" name="Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)">${text}</voice></speak>`;
  getAccessToken().then((access_token) => {
    const req = {
      method: "POST",
      body: post_speaker_data,
      credentials: "include",
      headers: {
        'content-type': 'application/ssml+xml',
        'x-microsoft-outputFormat': 'riff-16khz-16bit-mono-pcm',
        'Authorization': 'Bearer ' + access_token,
        'X-Search-AppId': '07D3234E49CE426DAA29772419F436CA',
        'X-Search-ClientID': '1ECFAE91408841A480F00935DC390960',
      }
    };
    return fetch('https://speech.platform.bing.com/synthesize', req);
  }).then((res) => {
    return res.arrayBuffer();
  }).then((buf) => {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var source = context.createBufferSource();
    return context.decodeAudioData(buf);
  }).then((buf1) => {
    source.buffer = buf1;
    source.connect(context.destination);
    source.start(context.currentTime);
  }).catch((err) => {
    console.dir(err, { depth: null });
  });
}

function getAccessToken() {
  var apiKey = "0bdca40a997b4e8299e26c4068943921";
  var reqOptions = {
    method: "POST",
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey
    }
  };
  if (!access_token) {
    return fetch('https://api.cognitive.microsoft.com/sts/v1.0/issueToken', reqOptions).then((res) => {
      return res.text();
    }).then((token) => {
      access_token = token;
    });
  } else {
    return Promise.resolve(access_token);
  }
}

function getAudioFromLocal(text) {
  if (text) {
    return fetch('http://localhost:1337/getAudio', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ "text": text }),
      headers: {
        'content-type': 'application/json'
      }
    }).then((res) => {
      return res.arrayBuffer();
    }).then((buf) => {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      context = new AudioContext();
      return context.decodeAudioData(buf);
    }).then((buf1) => {
      var source = context.createBufferSource();
      source.buffer = buf1;
      source.connect(context.destination);
      source.start(context.currentTime);
    }).catch((err) => {
      console.dir(err, { depth: null });
    });
  } else {
    return Promise.resolve();
  }
}
