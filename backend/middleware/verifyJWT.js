// json web token, form of user identification after a user is authenticated
// rest api issues the FE an aT via jwt and the client a  rT via cookie
// using the aT, add header Authorization and then Bearer space aT to use the verifyJWT and test other routes
const jwt = require("jsonwebtoken");

// all middleware receives req, res, next
const verifyJWT = (req, res, next) => {
  // || incase the auth is uppercase. aT is stored in the Authorization req header as a bearer token.
  // on this note, req.header does contain both cookie with rT (req.header.cookie) and jwt with aT (req.headers.authorization)
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // value should always start with Bearer with space and then token
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // splitting off Bearer and the space to just get the token, this is the aT
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    // we 'signed' the below info into the jwt in authController, after authenticating (userInfo object that contains username and roles)
    // so here we are decoding that info thats been 'signed' to the jwt with jwt.verify
    // verifying if the req.user = decoded etc
    req.username = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    req.userId = decoded.UserInfo.userId;
    next();
  });
};

module.exports = verifyJWT;

// Full MERN stack Ecommerce application using advanced redux toolkit query rest api to reduce api calls and component re renders via high perf caching. Advanced authorization implimention via front end and back end auth hooks to check roles of req sent, or conditionally render
