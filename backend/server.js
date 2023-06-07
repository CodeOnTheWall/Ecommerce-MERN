// req-middleware-res
// npm run dev for backend

// allows to use dotenv throughout the package (dont need to import to other files)
// to use env variables inside rest api
require("dotenv").config();

// NODEJS
const path = require("path");

// EXPRESS, all .app (app object) is express as well (inc all its methods, get, post, etc)
const express = require("express");
const app = express();

// 3rd party middleware
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

// run on process.env.PORT (prod) otherwise on 3000 (dev)
const PORT = process.env.PORT || 3500;

// initializing connection to mongoDB via mongoose
connectDB();

// stops other website from trying to access our apis
app.use(cors(corsOptions));

// Express 4.16 and later automatically parse URL-encoded data into the req.body object
// this middleware parses the inc JSON data and creates a JS object from the data.
// This JS object is then stored in the req.body object
app.use(express.json());
// parse cookies that we recieve
// parses Cookie header and populates req.cookies with an object keyed by the cookie names
app.use(cookieParser());

// listening for route route
// to serve static files such as images, CSS files, and JavaScript files,
// use the express.static built-in middleware function in Express.
// __dirname is a global variable that nodejs understands (look inside folder that we are in (of current file opened))
// so look inside backend dir, then look for public folder
app.use("/", express.static(path.join(__dirname, "public")));
// or, since its relative to folder we are in
// app.use(express.static('public'))

// PUBLIC ROUTES
// app.use("/cart", require("./routes/PUBLIC/cartRoutes"));
app.use("/employee-auth", require("./routes/PUBLIC/employeeAuthRoutes"));
app.use("/user-auth", require("./routes/PUBLIC/userAuthRoutes"));
// PROTECTED USER ROUTES
app.use("/users", require("./routes/PROTECTED/userRoutes"));
app.use("/cart", require("./routes/PROTECTED/cartRoutes"));
// app.use("/checkout", require("./routes/PROTECTED/checkoutRoutes"));
// PROTECTED ROUTES
app.use("/products", require("./routes/PROTECTED/productRoutes"));
app.use("/employees", require("./routes/PROTECTED/employeeRoutes"));

// put this after all the other routes to handle anything (*) not found
// status() sets a HTTP status on the response object to the client (to be seen in dev tools) or apart of res on client side
app.all("*", (req, res) => {
  // 404 not found
  res.status(404);
  // now looking at headers from req that come in, and determine what type of res to send
  // if req has an accepts header that is html
  if (req.accepts("html")) {
    // then send res to 404.html
    res.sendFile(path.join(__dirname, "views", "404.html"));
    // if header has json
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
    // if html or json wasnt matched in the accepts header
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// telling app to start listening on open event
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
