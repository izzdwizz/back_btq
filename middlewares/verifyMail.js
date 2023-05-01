const User = require("../Models/User");

const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send({
        status: "User Not Found",
        message: "No user with email or password",
      });
    }

    if (user.isVerified) {
      next();
    } else {
      res.status(400).send({
        status: "Error",
        message: "Account not Verified, please verify your account",
      });
    }
  } catch (error) {
    res.status(400).send({
      status: "Bad request",
      error: error.message,
    });
  }
};

module.exports = { verifyEmail };
