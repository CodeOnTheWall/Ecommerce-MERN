const express = require("express");
const router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");

// CONTROLLER HANDLES ROUTES
const {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../../controllers/PROTECTED/employeesController");

// /employees
router
  .route("/")
  .get(verifyJWT, getAllEmployees)
  .post(verifyJWT, createNewEmployee)
  .patch(verifyJWT, updateEmployee)
  .delete(verifyJWT, deleteEmployee);

module.exports = router;
