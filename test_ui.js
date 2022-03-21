const fs = require("fs");
const URL = require("url").URL;

// Read base config from file, check parent dir first.
let config;
let urls;
if (fs.existsSync("/srv/config/backstop_ui.json")) {
  config = JSON.parse(fs.readFileSync("/srv/config/backstop_ui.json"));
  urls_ui = fs.readFileSync("config/urls_ui.txt").toString().split("\n");
} else {
  config = JSON.parse(fs.readFileSync("backstop_ui.json"));
  urls_ui = fs.readFileSync("config/urls_ui.txt").toString().split("\n");
}

// Base URI.
require("dotenv").config();
let baseURI;
if (process.env.npm_lifecycle_event == "reference-ui") {
  baseURI = new URL(process.env.REF_URI);
} else {
  baseURI = new URL(process.env.TEST_URI);
}

payload = config.scenarios;
config.scenarios = [];

for (i in urls_ui) {
  let urlString = urls_ui[i];

  if (urlString) {
    let url = new URL(urlString);

    payload.forEach(function (item) {
      let scenario = {};

      clickSelector = item.clickSelector;

      let label = url.pathname + url.search + url.hash;
      if (label.length > 1) {
        label = label.replace(/^[^a-z]+|[^\w:.-]+/gi, "-");
        label = label.replace(/^-+/gi, "");
        label = label.replace(/-+$/gi, "");
      } else {
        label = "home";
      }

      label = item.label;

      url.protocol = baseURI.protocol;
      url.username = baseURI.username;
      url.password = baseURI.password;
      url.hostname = baseURI.hostname;
      url.port = baseURI.port;

      scenario.label = label;
      scenario.url = url.href;
      scenario.clickSelector = clickSelector;

      config.scenarios.push(scenario);
    });
  }
}
module.exports = config;
