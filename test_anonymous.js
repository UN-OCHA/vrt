const fs = require('fs');
const URL = require('url').URL;
const extend = require('util')._extend;

// Read base config from file, check config dir under parent dir first.
// urls are *always* under config.
let config;
let urls;
if (fs.existsSync('config/backstop_anon.json')) {
  config = JSON.parse(fs.readFileSync('config/backstop_anon.json'));
  urls = fs.readFileSync('config/urls_anon.txt').toString().split("\n");
}
else {
  config = JSON.parse(fs.readFileSync('backstop_anon.json'));
  urls = fs.readFileSync('config/urls_anon.txt').toString().split("\n");
}

// Base URI.
require('dotenv').config();
let baseURI;
if (process.env.npm_lifecycle_event == 'reference-anon') {
  baseURI = new URL(process.env.REF_URI);
}
else {
  baseURI = new URL(process.env.TEST_URI);
}

// Read first scenario for options.
let baseScenario = config.scenarios[0];
delete baseScenario.label;
delete baseScenario.url;
config.scenarios = [];

for (i in urls) {
  let urlString = urls[i];
  if (urlString) {
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
