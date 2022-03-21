const login = require("./login.js");
module.exports = async (page, scenario, vp) => {
  let baseURI;
  let loginPage;

  console.log("SCENARIO > " + scenario.label);

  await require("./clickAndHoverHelper")(page, scenario);

  if (process.env.npm_lifecycle_event == "reference-auth") {
    baseURI = new URL(process.env.REF_URI);
    loginPage = baseURI + login.refLoginPage;
    await page.goto(loginPage);
    await page.type(login.refUsernameInput, login.refUsername, { delay: 100 });
    await page.type(login.refPasswordInput, login.refPassword, { delay: 100 });
    await page.click(login.refSubmit);
  } else {
    baseURI = new URL(process.env.TEST_URI);
    loginPage = baseURI + login.testLoginPage;
    await page.goto(loginPage);
    await page.type(login.testUsernameInput, login.testUsername, {
      delay: 100,
    });
    await page.type(login.testPasswordInput, login.testPassword, {
      delay: 100,
    });
    await page.click(login.testSubmit);
  }

  await page.goto(scenario.url);
  await page.waitForTimeout(4000);
};
