const express = require("express");
const router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");

// CONTROLLER HANDLES ROUTES
const {
  getUserInfo,
  createNewUser,
  updateUser,
  deleteUser,
} = require("../../controllers/PROTECTED/usersController");

// /users
router
  .route("/")
  .get(verifyJWT, getUserInfo)
  .post(createNewUser)
  .patch(verifyJWT, updateUser)
  .delete(verifyJWT, deleteUser);

module.exports = router;
