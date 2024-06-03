// const express = require("express"); // Import the Express framework
// const mongoose = require("mongoose"); // Import Mongoose for MongoDB interactions
// const bodyParser = require("body-parser"); // Import body-parser to parse incoming request bodies
// const expensesRoutes = require("./routes/expensesRoutes"); // Import the expenses routes
// const authRoutes = require("./routes/authRoutes"); // Import the expenses routes
// const userRoutes = require("./routes/userRoutes"); // Import the expenses routes

// const app = express(); // Create an instance of the Express application
// app.use(bodyParser.json()); // Middleware to parse JSON bodies in incoming requests
// app.use("/expenses", expensesRoutes); // Mount the expenses routes at the "/expenses" path
// app.use("/user", userRoutes); // Mount the expenses routes at the "/expenses" path
// app.use("/", authRoutes); // Mount the expenses routes at the "/expenses" path

// // MongoDB connection string (local database in this case)
// const mongoUri = process.env.MONGODB_URI;

// // Connect to MongoDB
// mongoose
//   .connect(mongoUri, {
//     useNewUrlParser: true, // Use the new connection string parser
//     useUnifiedTopology: true, // Use the new topology engine for better stability
//   })
//   .then(() => console.log("Connected to MongoDB")) // Log success message on successful connection
//   .catch((err) => console.error("Error connecting to MongoDB:", err)); // Log error message on connection failure

// // Start the Express server on port 3000
// app.listen(4000, () => {
//   console.log("Server is running on port 4000"); // Log a message when the server starts
// });
// server.js

// const express = require("express");
// const app = express();

// // A simple get greet method
// app.get("/greet", (req, res) => {
//   // get the passed query
//   const { name } = req.query;
//   res.send({ msg: `Welcome ${name}!` });
// });

// // export the app for vercel serverless functions
// module.exports = app;
"use strict";
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expensesRoutes = require("./routes/expensesRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(bodyParser.json());
app.use("/expenses", expensesRoutes);
app.use("/user", userRoutes);
app.use("/", authRoutes);

app.get("/greet", (req, res) => {
  // get the passed query
  const { name } = req.query;
  res.send({ msg: `Welcome ${name}!` });
});
console.log("AAAAA", process.env.MONGODB_URI);
const mongoUri = process.env.MONGODB_URI;

// mongoose
//   .connect(mongoUri, {
//     // useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Error connecting to MongoDB:", err));

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
