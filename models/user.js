const mongoose = require("mongoose"); // Import Mongoose to interact with MongoDB

// Define a new Mongoose schema for user
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// Create a Mongoose model from the schema
const User = mongoose.model("User", userSchema); // The model represents the 'user' collection in MongoDB

// Export the User model for use in other parts of the project
module.exports = User; // This allows other files to import and use the User model
