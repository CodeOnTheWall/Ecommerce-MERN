const express = require("express");
const router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");

// CONTROLLER HANDLES ROUTES
const {
  getAllProducts,
  addNewProduct,
  updateProduct,
  deleteProduct,
} = require("../../controllers/PROTECTED/productsController");

// content type auto set by express inside headers
router
  // /products is the endpoint
  .route("/")
  .get(getAllProducts)
  .post(verifyJWT, addNewProduct)
  .patch(verifyJWT, updateProduct)
  .delete(verifyJWT, deleteProduct);

module.exports = router;
