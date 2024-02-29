module.exports = async (page, scenario, vp) => {
  console.log('SCENARIO > ' + scenario.label);
  await require('./clickAndHoverHelper')(page, scenario);

  // Load the (session) cookie.
  await require('./loadCookies')(page, scenario);

  // For now, do not wait for the .user-logged-in class.
};
