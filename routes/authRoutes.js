const express = require("express"); // Import Express framework
const authController = require("../controllers/authController"); // Import the user controller
const router = express.Router(); // Create a new Express router

// Use controller functions for CRUD operations on users
router.post("/signup", authController.signup); // Create a new user
router.post("/login", authController.login); // Get all users
router.post("/forgotpassword", authController.forgotPassword);

router.post(
  "/resetpassword",
  // userValidator.forgotPassword(),
  // userValidator.validate,
  authController.resetPassword
);

module.exports = router; // Export the router for use in other parts of the application
