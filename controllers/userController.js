// Import the Mongoose model for users
const User = require("../models/user");
const apiResponse = require("../utils/apiResponse");

// Controller function to create a new user
const createUser = async (req, res) => {
  // Extract user details from the request body
  const { firstName, lastName, email, password } = req.body;

  // Create a new user instance with the extracted data
  const user = new User({ firstName, lastName, email, password });

  try {
    // Save the user to the database
    const savedUser = await user.save();

    // If the user is successfully saved, return a 201 (Created) status with the saved user's data
    return apiResponse(res, 201, true, "User create successfully", savedUser);
  } catch (error) {
    // If there's an error during saving, return a 400 (Bad Request) status with the error message
    return apiResponse(res, 500, false, error.message);
  }
};

// Controller function to get all users from the database
const getUsers = async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find();

    // Return the list of users as a JSON response
    return apiResponse(res, 200, true, "All users", users);
  } catch (error) {
    // If there's an error during retrieval, return a 500 (Internal Server Error) status with the error message
    return apiResponse(res, 500, false, error.message);
  }
};

// Controller function to get a user by its ID
const getUserById = async (req, res) => {
  try {
    // Find the user in the database by its ID
    const user = await User.findById(req.params.id);

    if (!user) {
      return apiResponse(res, 404, false, "User not found");
      // If no user is found, return a 404 (Not Found) status with an error message
    }

    // If the user is found, return the user's details as a JSON response
    return apiResponse(res, 200, true, "Single user", user);
  } catch (error) {
    // If there's an error during retrieval, return a 500 (Internal Server Error) status with the error message
    return apiResponse(res, 500, false, error.message);
  }
};

// Controller function to update a user by its ID
const updateUser = async (req, res) => {
  // Extract updated user details from the request body
  const { firstName, lastName, email, password } = req.body;

  try {
    // Find the user by its ID and update it with the new data
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, password }, // New data to update
      { new: true, runValidators: true } // Return the updated document and ensure data validation
    );

    if (!updatedUser) {
      return apiResponse(res, 404, false, "User not found");
      // If no user is found for the given ID, return a 404 (Not Found) status
    }

    // Return the updated user details as a JSON response
    return apiResponse(res, 200, true, "User update successfully", updatedUser);
  } catch (error) {
    // If there's an error during update, return a 400 (Bad Request) status with the error message
    return apiResponse(res, 500, false, error.message);
  }
};

// Controller function to delete a user by its ID
const deleteUser = async (req, res) => {
  try {
    // Find the user by its ID and delete it
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return apiResponse(res, 404, false, "User not found");
      // If no user is found, return a 404 (Not Found) status with an error message
    }

    // If the user is deleted successfully, return a success message as a JSON response
    return apiResponse(res, 200, true, "User delete successfully");
  } catch (error) {
    // If there's an error during deletion, return a 500 (Internal Server Error) status with the error message
    return apiResponse(res, 500, false, error.message);
  }
};

// Export all the controller functions
module.exports = {
  createUser, // Export the createUser function
  getUsers, // Export the getUsers function
  getUserById, // Export the getUserById function
  updateUser, // Export the updateUser function
  deleteUser, // Export the deleteUser function
};
