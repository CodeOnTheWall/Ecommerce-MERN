const express = require("express");
const router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");

// CONTROLLER HANDLES ROUTES
const {
  viewCartItems,
  addToCart,
  deleteAllFromCart,
  deleteFromCart,
} = require("../../controllers/PROTECTED/cartController");

// content type auto set by express inside headers
// /cart

router.route("/").get(verifyJWT, viewCartItems);
router.route("/add").post(verifyJWT, addToCart);
router.route("/delete").delete(verifyJWT, deleteFromCart);
router.route("/delete-all").delete(verifyJWT, deleteAllFromCart);

module.exports = router;
