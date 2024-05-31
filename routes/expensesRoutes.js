const express = require("express"); // Import Express framework
const expensesController = require("../controllers/expensesController"); // Import the expenses controller
const router = express.Router(); // Create a new Express router
const auth = require("../middleware/auth");

// Use controller functions for CRUD operations on expensess
router.post("/", auth, expensesController.createExpenses); // Create a new expenses
router.get("/", auth, expensesController.getExpensess); // Get all expensess
router.get("/:id", auth, expensesController.getExpensesById); // Get a expenses by its ID
router.put("/:id", auth, expensesController.updateExpenses); // Update a expenses by its ID
router.delete("/:id", auth, expensesController.deleteExpenses); // Delete a expenses by its ID

module.exports = router; // Export the router for use in other parts of the application
