// Import the User model from the Mongoose library
const User = require("../models/user");
const bcrypt = require("bcrypt"); // Import the bcrypt library for password hashing
const jwt = require("jsonwebtoken"); // Import the JSON Web Token library for token generation
const { sendMail } = require("../utils/send-mail");
const ForgetPasswordEmail = require("../emailTemplates/forgotPassword");
const { promisify } = require("util");
const apiResponse = require("../utils/apiResponse");

// Controller function to handle user signup (registration)
const signup = async (req, res) => {
  // Destructure user details from the request body
  const { firstName, lastName, email, password } = req.body;

  // Create a new User instance with the provided data
  const user = new User({ firstName, lastName, email, password });

  // Find a user in the database by email
  const userFound = await User.findOne({ email: user.email });

  // If no user is found, throw an error
  if (userFound) {
    return apiResponse(res, 400, false, "User already exists with this email");
  }
  // Hash the password with bcrypt, using a salt factor of 10
  const hashPassword = await bcrypt.hash(password, 10);

  // Assign the hashed password to the user instance
  user.password = hashPassword;

  try {
    // Save the new user to the MongoDB database
    const savedUser = await user.save();

    // Make a copy of the saved user and delete the password field from the response
    const userResponse = savedUser.toObject(); // Convert to plain JS object
    delete userResponse.password; // Remove password field

    // Respond with the saved user and a 201 (Created) status code
    return apiResponse(
      res,
      201,
      true,
      "User create successfully",
      userResponse
    );
  } catch (error) {
    // If an error occurs, respond with a 400 (Bad Request) status code and the error message
    return apiResponse(res, 500, false, error.message);
  }
};

// Controller function to handle user login
const login = async (req, res) => {
  try {
    // Destructure email and password from the request body
    const { email, password } = req.body;

    // Find a user in the database by email
    const user = await User.findOne({ email });

    // If no user is found, throw an error
    if (!user) {
      return apiResponse(res, 404, false, "User not found with this email");
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatched = await bcrypt.compare(password, user.password);

    // If the password doesn't match, throw an error
    if (!passwordMatched) {
      return apiResponse(res, 400, false, "Password not matched");
    }

    // Create a payload for the JWT with user ID and email
    const payload = {
      _id: user._id,
      email: user.email,
    };

    // Define a secret key for signing the JWT
    const secretKey = "Hello World";

    // Sign the JWT with the payload, secret key, and expiration of 2 days
    const token = await jwt.sign(payload, secretKey, { expiresIn: "2d" });

    // Create a new object to return without the password field
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName, // Include the first name
      lastName: user.lastName, // Include the last name
      // Include additional user fields if needed
    };

    // Create a data object to send in the response
    const data = {
      user: userWithoutPassword, // User data without the password field
      token, // The signed JWT token
    };

    // Respond with the user data and JWT token
    return apiResponse(res, 200, true, "Login successfully", data);
  } catch (error) {
    // If an error occurs, respond with a 500 (Internal Server Error) status code and the error message
    return apiResponse(res, 200, false, error.message);
  }
};

const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return apiResponse(res, 404, false, "No active user with this email");
    }
    // const encryptPassword = await bcrypt.hash(password, 12);
    // user.password = encryptPassword;
    // await user.save()
    const payload = {
      user: {
        id: user.id,
      },
    };

    // token expires in 48 hours
    jwt.sign(
      payload,
      "Hello World",
      { expiresIn: "20m" },
      async (error, token) => {
        if (error) throw error;
        // //user language
        // let language_code;

        // if (user?.dataValues?.language) {
        //   const result = languageWithcode.filter(
        //     (lang) => lang.name == user?.dataValues?.language
        //   );

        //   if (result.length > 0) {
        //     language_code = result[0].code;
        //   }
        // } else {
        //   language_code = "en";
        // }

        // req.i18n.changeLanguage(language_code);
        const html = ForgetPasswordEmail.email(
          "http://localhost:4000/resetpassword",
          token,
          req
        );

        const mailOptions = {
          to: email,
          subject: "Here's your password reset link!",
          text: "click on Button to Reset ",
          html: html,
        };

        sendMail(mailOptions);
        // if (user.role == "super-admin") {
        //   return res.status(200).json({
        //     error: "Please check your mail reset password link has been sent",
        //   });
        // }
        return apiResponse(
          res,
          200,
          true,
          "Please check your mail reset password link has been sent"
        );
      }
    );
  } catch (error) {
    return apiResponse(res, 500, false, error.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    const { newPassword } = req.body;
    const decoded = await promisify(jwt.verify)(token, "Hello World");
    if (!decoded) {
      return apiResponse(res, 401, false, "Invalid forgot password link");
    }
    const user = await User.findOne({
      _id: decoded.user.id,

      // attributes: {
      //   include: ["password"],
      // },
    });
    if (!user) {
      return apiResponse(res, 404, false, "No active user with this email");
    }
    const encryptPassword = await bcrypt.hash(newPassword, 12);
    user.password = encryptPassword;
    await user.save();
    return apiResponse(res, 200, true, "Updated password successfully");
  } catch (error) {
    if (error?.message === "jwt expired") {
      return apiResponse(
        res,
        401,
        false,
        "Forgot password link has been expired"
      );
    } else if (error?.message === "jwt malformed") {
      return apiResponse(res, 401, false, "Invalid forgot password link");
    } else {
      return apiResponse(res, 401, false, "Unauthorized access");
    }
  }
};

// Export the controller functions for use in other parts of the application
module.exports = {
  signup, // Controller for creating a new user
  login, // Controller for user login
  forgotPassword,
  resetPassword,
};
