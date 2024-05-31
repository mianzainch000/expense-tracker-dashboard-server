const express = require("express"); // Import Express framework
const userController = require("../controllers/userController"); // Import the user controller
const router = express.Router(); // Create a new Express router

// Use controller functions for CRUD operations on users
router.post("/", userController.createUser); // Create a new user
router.get("/", userController.getUsers); // Get all users
router.get("/:id", userController.getUserById); // Get a user by its ID
router.put("/:id", userController.updateUser); // Update a user by its ID
router.delete("/:id", userController.deleteUser); // Delete a user by its ID

module.exports = router; // Export the router for use in other parts of the application
