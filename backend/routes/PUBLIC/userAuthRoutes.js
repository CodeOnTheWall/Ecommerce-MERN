const express = require("express");
const router = express.Router();
const userAuthController = require("../../controllers/PUBLIC/userAuthController");
const loginLimiter = require("../../middleware/loginLimiter");

// rest api sends and recieves access tokens as json data.
// when app is closed, access token is lost as its stored in memory
// rest api will issue refresh tokens which are in an httpOnly cookie, these tokens do expire and will require login again
// with these tokens, client can access protected api routes until expiration

//  "/" is /employee-auth

router.route("/").post(loginLimiter, userAuthController.login);
router.route("/refresh").get(userAuthController.refresh);
router.route("/logout").post(userAuthController.logout);

module.exports = router;
