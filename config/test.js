const fs = require('fs');
const URL = require('url').URL;
const extend = require('util')._extend;

require('dotenv').config();

let repos = JSON.parse(fs.readFileSync('config/repo_urls.json'));
let repo = process.env.REPO
let environment = process.env.ENVIRONMENT
let logged_in_status = process.env.LOGGED_IN_STATUS

let config = JSON.parse(fs.readFileSync('backstop_' + logged_in_status + '.json'));
let urls = fs.readFileSync('config/sites/' + repo.toLowerCase() + '_' + logged_in_status + '.txt').toString().split("\n");

// Base URI.
let baseURI = new URL(repos[repo][environment + '_uri']);

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
