// A Mongoose schema defines the structure of the document, default values,
// validators, etc., whereas a Mongoose model provides an interface to the
// database for creating, querying, updating, deleting records
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

// mongoose will auto make Cart, carts (lowercase and plural)
module.exports = mongoose.model("Cart", cartSchema);
