const fs = require('fs');
const URL = require('url').URL;
const extend = require('util')._extend;

// Read base config from file, check config dir under parent dir first.
// urls are *always* under config.
let config;
let urls;
if (fs.existsSync('config/backstop_auth.json')) {
  config = JSON.parse(fs.readFileSync('config/backstop_auth.json'));
  urls = fs.readFileSync('config/urls_auth.txt').toString().split("\n");
}
else {
  config = JSON.parse(fs.readFileSync('backstop_auth.json'));
  urls = fs.readFileSync('config/urls_auth.txt').toString().split("\n");
}

// Base URI.
require('dotenv').config();
let baseURI;
let userId;
if (process.env.npm_lifecycle_event == 'reference-auth') {
  baseURI = new URL(process.env.REF_URI);
  userId = process.env.REF_UID || '';
}
else {
  baseURI = new URL(process.env.TEST_URI);
  userId = process.env.TEST_UID || '';
}


// Read first scenario for options.
let baseScenario = config.scenarios[0];
delete baseScenario.label;
delete baseScenario.url;
config.scenarios = [];

for (i in urls) {
  let urlString = urls[i];
  if (urlString) {

    if (userId.length > 0) {
      urlString = urlString.replace('/%%UID%%/', userId);
    }

    let url = new URL(urlString);
    let scenario = Object.assign({}, baseScenario);

    let label = url.pathname + url.search + url.hash;
    if (label.length > 1) {
      label = label.replace(/^[^a-z]+|[^\w:.-]+/gi, '-');
      label = label.replace(/^-+/gi, '');
      label = label.replace(/-+$/gi, '');
    }
    else {
      label = 'home';
    }

    url.protocol = baseURI.protocol;
    url.username = baseURI.username;
    url.password = baseURI.password;
    url.hostname = baseURI.hostname;
    url.port = baseURI.port;


    scenario.url = url.href;
    scenario.label = label;
    config.scenarios.push(scenario);
  }
}

module.exports = config;
