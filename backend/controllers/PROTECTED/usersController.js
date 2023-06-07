// getting mongoose models
// Mongoose model provides an interface to the database for creating, querying, updating, deleting records
const User = require("../../models/User");
const bcrypt = require("bcrypt");

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

// no next on controller methods, since the controller is the final step when processing the data and sending a response

// ALL METHODS ON MONGOOSE MODELS ARE MONGOOSE METHODS - NOT MONGODB METHODS
// trying to handle as much specific err as possible, all other err not handled
// will be kicked to custom error handler

// NOTE ABOUT RES.JSON - to access, save response in variable and then use useState
// via rtkq, accessible via error.data.message

// GET USER INFO, /users - GET, access private
const getUserInfo = async (req, res) => {
  const { id } = req.body;

  const user = await User.findById(id).select("-password").lean().exec();

  if (req.user !== user.username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!user) {
    return res.status(400).json({ message: "No user found" });
  }
  // .json converts js object to json to be sent to fE
  res.json(user);
};

// CREATE NEW USER, /users - POST, access private
const createNewUser = async (req, res) => {
  const { username, password } = req.body;

  // confirm data
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate username
  const duplicate = await User.findOne({ username })
    // collation with strength 2 checks for case sensitivity, hence I can find via walter or Walter, since user could have logged in with lowercase
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    // 409 conflict
    return res.status(409).json({ message: "Username Taken" });
  }

  // Hash password - passing in password from req.body, salting 10 times
  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject = { username, password: hashedPwd };

  // Create and store new user - dont need .exec as not querying anything
  const user = await User.create(userObject);

  // if we created user
  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
};

// UPDATE USER, /users - PATCH, access private
const updateUser = async (req, res) => {
  const { id, username, password } = req.body;

  if (req.user !== user.username) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Confirm data
  if (!id || !username) {
    return (
      res
        // bad req 400
        .status(400)
        .json({ message: "All fields except password are required" })
    );
  }

  // Does the user exist to update?
  // not calling lean so i have access to methods like save
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicate - chaining lean because dont need the methods returned with this, and exec as well
  const duplicate = await User.findOne({ user })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  // Allow updates to the original user, so cant just look for duplicates
  // and end func, as then the user updating couldnt update themselves

  // mongodb stores id as such: _id
  // if duplicate doesnt equal the id from req.body, then we have duplicate username
  // but if it does equal, then we are just working with same person
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  user.username = username;

  // reason being seperate is maybe user wont always want to update pw
  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10);
  }

  // this is where i needed the mongoosedoc so that i have the save method (by not using .lean)
  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
};

// DELETE USER, /users - DELETE, access private
const deleteUser = async (req, res) => {
  // destructure id from req.body
  const { id } = req.body;

  if (req.user !== user.username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // result recieves the full user object that was deleted
  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
};

module.exports = {
  getUserInfo,
  createNewUser,
  updateUser,
  deleteUser,
};
