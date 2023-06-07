// A Mongoose schema defines the structure of the document, default values,
// validators, etc., whereas a Mongoose model provides an interface to the
// database for creating, querying, updating, deleting records
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  //   using array as there is an array of roles, different types of roles
  roles: {
    type: [String],
    default: ["Employee"],
  },
  active: {
    type: Boolean,
    // auto active (true) on new user creation
    default: true,
  },
});

// mongoose will auto make Employee, employees (lowercase and plural)
module.exports = mongoose.model("Employee", employeeSchema);
