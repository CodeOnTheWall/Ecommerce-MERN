// only these urls are allowed access to the apis
const allowedOrigins = require("./allowedOrigins");

// 3rd party middleware, following their syntax
const corsOptions = {
  // if the domain is in the whitelist (!== -1). after development, remove || !origin, this is only for developement
  // leave without origin for dev to test with postman
  // going to recieve origin and a callback function
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // callback if we are successful
      // null is error object which we wont have, second is allowed boolean which is true
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  // sets the access control allow credentials header to true
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
