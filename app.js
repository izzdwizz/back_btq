require("dotenv").config();
const express = require("express");
require("./db/mongoose");
const userRouter = require("./Routes/user");

const app = express();
app.use(express.json());

app.use(userRouter);

// -- connect to a db
// -- Sign Up User
// -- Sign in User
// -- get User Profile
// --update count

module.exports = app;
