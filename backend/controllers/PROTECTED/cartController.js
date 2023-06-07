// getting mongoose models
// Mongoose model provides an interface to the database for creating, querying, updating, deleting records
const Product = require("../../models/Product");
const Cart = require("../../models/Cart");
const User = require("../../models/Cart");

// MONGOOSE - here im using mongoose methods on my Product Model
// in headers on postman/thunderclient add Content-Type app/json for testing (and send raw data in body)
// { i.e.
//   "username": "little",
//   "password": "apple",
//   "roles": [ "Admin" ]
// }

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

// GET ALL CART ITEMS, /cart - GET, private access
const viewCartItems = async (req, res) => {
  const cartItems = await Product.find().lean();

  // if no products or there is products but has no length
  if (!products?.length) {
    return res.status(400).json({ message: "No products found" });
  }

  // sending products as a json string to client
  res.json(products);
};

// ADD TO CART, /cart/add - POST, private access
const addToCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId;
  console.log(userId);

  if (!productId || !userId) {
    console.log("here");
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const userWithCart = await User.findOne({ userId }).exec();
    console.log(userWithCart);

    if (!userWithCart) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the user doesn't have a cart, create a new one
    if (!userWithCart.cart) {
      const newCart = new Cart({
        username: userWithCart._id,
        products: [product],
      });
      await newCart.save();
      userWithCart.cart = newCart._id;
    } else {
      // If the user already has a cart, add the product to it
      userWithCart.cart.products.push(product);
      await userWithCart.cart.save();
    }

    // Save the updated user
    await userWithCart.save();

    return res
      .status(200)
      .json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE NOTE, /notes - PATCH, private access
const deleteAllFromCart = async (req, res) => {
  const { id, title, description, price } = req.body;

  // Confirm data
  if (!id || !title) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm note exists to update
  const product = await Product.findById(id).exec();

  if (!product) {
    return res.status(400).json({ message: "Product not found" });
  }

  // Check for duplicate title
  const duplicate = await Product.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  // Allow renaming of the original product
  // if duplicate doesnt equal id from req.body then duplicate
  // otherwise its a note of person making the change
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate product title" });
  }

  product.title = title;
  product.price = price;
  product.description = description;

  const updatedProduct = await product.save();

  res.json(`'${updatedProduct.title}' updated`);
};

// DELETE NOTE, /notes - DELETE, private access
const deleteFromCart = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Product ID required" });
  }

  // Confirm note exists to delete
  const product = await Product.findById(id).exec();

  if (!product) {
    return res.status(400).json({ message: "Product not found" });
  }

  // deletes from collection
  const result = await product.deleteOne();

  const reply = `Product '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
};

module.exports = {
  viewCartItems,
  addToCart,
  deleteAllFromCart,
  deleteFromCart,
};
