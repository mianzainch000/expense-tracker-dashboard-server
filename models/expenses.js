const mongoose = require("mongoose"); // Import Mongoose to interact with MongoDB

// Define a new Mongoose schema for expensess
const expensesSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Title field, required to be a string
  description: { type: String, required: true }, // Author field, required to be a string
  amount: Number, // Published year field, optional and of type Number
  paymentType: { type: String, required: true },
  type: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
});

// Create a Mongoose model from the schema
const Expenses = mongoose.model("Expenses", expensesSchema); // The model represents the 'expensess' collection in MongoDB

// Export the Expenses model for use in other parts of the project
module.exports = Expenses; // This allows other files to import and use the Expenses model
