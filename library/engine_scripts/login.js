module.exports = {
  refLoginPage: process.env.REF_LOGIN_PAGE || "/user/login/hid",
  refUsernameInput: process.env.REF_USERNAME_INPUT || "#email",
  refPasswordInput: process.env.REF_PASSWORD_INPUT || "#password",
  refSubmit: process.env.REF_SUBMIT || ".t-btn--login",
  refUsername: process.env.REF_USERNAME,
  refPassword: process.env.REF_PASSWORD,

  testLoginPage: process.env.TEST_LOGIN_PAGE || "/user/login/hid",
  testUsernameInput: process.env.TEST_USERNAME_INPUT || "#email",
  testPasswordInput: process.env.TEST_PASSWORD_INPUT || "#password",
  testSubmit: process.env.TEST_SUBMIT || ".t-btn--login",
  testUsername: process.env.TEST_USERNAME,
  testPassword: process.env.TEST_PASSWORD,
};
