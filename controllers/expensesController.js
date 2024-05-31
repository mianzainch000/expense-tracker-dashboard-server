const Expenses = require("../models/expenses"); // Import the Mongoose model for expensess
const apiResponse = require("../utils/apiResponse");

// Controller to create a new expenses
const createExpenses = async (req, res) => {
  // Extract expenses details from the request body

  const { date, description, amount, paymentType, type } = req.body;
  // Create a new expenses instance with the provided data

  const expenses = new Expenses({
    date,
    description,
    amount,
    paymentType,
    type,
    user: req.user._id,
  });

  try {
    // Save the expenses to the database
    const savedExpenses = await expenses.save();

    // Return the saved expenses with a 201 (Created) status
    return apiResponse(
      res,
      201,
      true,
      "Expense create successfully",
      savedExpenses
    );
  } catch (error) {
    // If there's an error, return a 400 (Bad Request) status with the error message
    return apiResponse(res, 500, false, error.message);
  }
};

// Controller to get all expensess
const getExpensess = async (req, res) => {
  try {
    let account = 0;
    let cash = 0;
    let totalIncome = 0;
    let totalExpenses = 0;
    let currentBalance = 0;
    // Retrieve all expensess from the database
    const expensess = await Expenses.find({ user: req.user._id });

    expensess.map((exp) => {
      if (exp.type === "income") {
        totalIncome = totalIncome + exp.amount;
      } else {
        totalExpenses = totalExpenses + exp.amount;
      }

      if (exp.paymentType === "account" && exp.type === "expense") {
        account = account - exp.amount;
      } else if (exp.paymentType === "account" && exp.type === "income") {
        account = account + exp.amount;
      }

      if (exp.paymentType === "cash" && exp.type === "expense") {
        cash = cash - exp.amount;
      } else if (exp.paymentType === "cash" && exp.type === "income") {
        cash = cash + exp.amount;
      }

      currentBalance = totalIncome - totalExpenses;
    });
    console.log("totalIncome", totalIncome);
    console.log("totalExpenses", totalExpenses);
    console.log("currentBalance", currentBalance);

    const data = {
      expensess,
      totalIncome,
      totalExpenses,
      currentBalance,
      cash,
      account,
    };
    // Return the list of expensess
    return apiResponse(res, 200, true, "All expenses", data);
  } catch (error) {
    // If there's an error, return a 500 (Internal Server Error) status with the error message
    return apiResponse(res, 500, false, error.message);
  }
};

// Controller to get a expenses by its ID
const getExpensesById = async (req, res) => {
  try {
    // Find the expenses by its ID
    const expenses = await Expenses.findById(req.params.id);

    if (!expenses) {
      // If the expenses is not found, return a 404 (Not Found) status
      return apiResponse(res, 404, false, "Expenses not found");
    }

    // Return the expenses details
    return apiResponse(res, 200, true, "Get expense", expenses);
  } catch (error) {
    // If there's an error, return a 500 (Internal Server Error) status with the error message
    return apiResponse(res, 500, false, error.message);
  }
};

// Controller to update a expenses by its ID
const updateExpenses = async (req, res) => {
  // Extract updated expenses details from the request body
  const { date, description, amount, paymentType, type } = req.body;

  try {
    // Find the expenses by its ID and update it with the new data
    const updatedExpenses = await Expenses.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { date, description, amount, paymentType, type },
      { new: true, runValidators: true } // Options to return the updated document and run validation
    );

    if (!updatedExpenses) {
      return apiResponse(res, 404, false, "Expenses not found");
      // If the expenses is not found, return a 404 (Not Found) status
    }

    // Return the updated expenses details
    return apiResponse(
      res,
      200,
      true,
      "Expenses update successfully",
      updatedExpenses
    );
  } catch (error) {
    return apiResponse(res, 500, false, error.message);
    // If there's an error, return a 400 (Bad Request) status with the error message
  }
};

// Controller to delete a expenses by its ID
const deleteExpenses = async (req, res) => {
  try {
    // Find the expenses by its ID and delete it
    const deletedExpenses = await Expenses.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deletedExpenses) {
      return apiResponse(res, 404, false, "Expenses not found");
      // If the expenses is not found, return a 404 (Not Found) status
    }

    // Return a success message
    return apiResponse(res, 200, true, "Expenses delete successfully");
  } catch (error) {
    // If there's an error, return a 500 (Internal Server Error) status with the error message
    return apiResponse(res, 500, false, error.message);
  }
};

// Export all controller functions
module.exports = {
  createExpenses, // Create a expenses
  getExpensess, // Get all expensess
  getExpensesById, // Get a expenses by its ID
  updateExpenses, // Update a expenses by its ID
  deleteExpenses, // Delete a expenses by its ID
};
