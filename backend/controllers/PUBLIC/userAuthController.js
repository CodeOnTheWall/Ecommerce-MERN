// to test in postman: add content-type application/json - cookie is seen on top right of postman in cookie manager
// if testing routes that need aT - header is Authorization, value is Bearer aT (Bearer space aT)
// A Mongoose schema defines the structure of the document, default values,
// validators, etc., whereas a Mongoose model provides an interface to the
// database for creating, querying, updating, deleting records

// REMINDER ALL METHODS HERE FOR QUERYING ARE MONGOOSE METHODS
// lean() mongoose method:
// still executes the query but:
// Docs returned from queries with the lean option enabled are plain javascript
// objects, not Mongoose Documents. They have no save method, getters/setters, virtuals,
// or other Mongoose features. lean is great for high-perf, read-only cases
// exec() mongoose method:
// executes the query that is built
// EXEC VS NO EXEC:
// use of exec() method depends on the type of query you are executing
// if the query returns a cursor to a set of documents, you can use await
// directly on the Query object returned by Mongoose. But if you are
// executing a query that returns a single document, you need to call the
// exec() method to execute the query and return the document.
// in 'general' if passing something in to query, use .exec

const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// VIEW authFlow.txt for step by step breakdown of endpoints

// LOGIN, /user-auth - POST, access public
const login = async (req, res) => {
  // req.body is the body from authApiSlice on front end
  const { username, password } = req.body;
  if (!username || !password) {
    // bad req status (400) with a json object containing message
    // this server side validation should only be triggered via someone
    // using i.e. postman to bypass FE login form validation
    return res.status(400).json({ message: "All fields are required" });
  }

  // findOne method returns a query object that represents the query to be executed (i.e. fineOne with name: username)
  // hence, to actually execute, use exec()
  const foundUser = await User.findOne({ username }).exec();
  // if didnt find that user, or the foundUser isnt active (employee deactivated for some reason etc)
  if (!foundUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // using bcrypt to compare passwords
  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) return res.status(401).json({ message: "Unauthorized" });

  // IF MATCH

  // 'signing' the jwt with a payload (userInfo)
  // use hex in terminal to create random secret numbers (node, require('crypto').randomBytes(64).toString('hex'))
  // jwt must inc payload, secret (only known to the server generating the token - so that it can only communicate with that server), optional options
  // jwt.sign algorithm is HMACSHA256
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        userId: foundUser.id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
    // { expiresIn: "30s" }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // CLIENT refers to the application that is running on the users device (website/app) thats making req to server

  // sending clients browser a rT via cookie
  // cookie is sent with every req and gets automatically applied to all paths
  res.cookie("jwt", refreshToken, {
    // making it secure via httpOnly: true - which makes this not available to JS
    httpOnly: true,
    // https, secure only for production, otherwise i cant test in postman, the rT wont re issue a new accessToken
    // or, remove 'secure' from cookie manager in postman
    secure: true,
    // cross-site cookie, want cross site availability to be possible if hosting rest api on one server and app on other server
    sameSite: "None",
    // cookie expiry: set to match rT - 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // aT are stored in memory because they have a shorter lifespan than
  // refresh tokens and are used more frequently. Storing aT in memory
  // allows them to be easily accessed and used by the client-side code
  // for making API requests without having to constantly retrieve them from the server.
  // sending a aT as json to front end, json() converts from js to json to be sent to front end - under the hood its json.stringify (js obj to json)
  // client side code can then extract aT from json res and use it in subsequent req to the server
  // by inc it in the Authorization header with bearer scheme
  // aT is stored in memory on client side, i.e. in our redux state, which isnt available to browser and means that refreshes will wipe this 'in memory storage'
  res.json({ accessToken });
};

// REFRESH, /user-auth/refresh - GET, access public
const refresh = (req, res) => {
  // the cookie contains the jwt
  // Cookies are small files/data that are sent to client with a server
  // request and stored on the client side. Every time the user loads the
  // website, this cookie is sent with the request. This helps us keep track of the user’s actions.
  const cookies = req.cookies;

  // optional chaining, if we dont have cookie, and also if we do have cookie but not named jwt
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  // if we do have cookies, set rT to that cookie
  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    // rT secret
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      // decoded username should be inside rT
      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });
      // if we do, create new access token
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
        // { expiresIn: "30s" }
      );

      res.json({ accessToken });
    }
  );
};

// LOGOUT, /user-auth/logout - POST, access public - to clear cookie if exists
// reminder on front end when we logout we also need to delete the access token
// extra layer of security so when someone logs out, we remove the token instead of letting it expire
// delete access token on front end and refresh token on backend
const logout = (req, res) => {
  const cookies = req.cookies;
  // user carries cookies around
  // if no cookies, or if cookie but no jwt
  if (!cookies?.jwt) return res.sendStatus(204);
  // have to pass in same options when creating cookie (except max age), add secure: true in prod
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  refresh,
  logout,
};
