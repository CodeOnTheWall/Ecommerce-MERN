// A Mongoose schema defines the structure of the document, default values,
// validators, etc., whereas a Mongoose model provides an interface to the
// database for creating, querying, updating, deleting records
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
});

// mongoose will auto make User, users (lowercase and plural)
module.exports = mongoose.model("User", userSchema);
