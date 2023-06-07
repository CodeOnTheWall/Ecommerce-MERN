// A Mongoose schema defines the structure of the document, default values,
// validators, etc., whereas a Mongoose model provides an interface to the
// database for creating, querying, updating, deleting records
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    // Server-side validation using the required property in Mongoose adds an
    // extra layer of data integrity and security. It ensures that even if someone
    // bypasses or manipulates the front-end validation, the server will still
    // reject invalid data and prevent it from being saved to the database
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// mongoose will auto make Product, products (lowercase and plural)
module.exports = mongoose.model("Product", productSchema);
