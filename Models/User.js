const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: [true, "Username is required"],
    unique: [true, "usernsme already exists"],
    max: 40,
    min: [3, "Username cannot be less than 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Enter Your Email address"],
    trim: true,
    unique: [true, "Email already exists"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Enter a valid email address");
      }
    },
  },
  password: {
    type: String,
    required: [true, "Enter Your Password"],
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("pasword cannot be used as a password");
      }
    },
    // validate(value) {
    //   if (value.isStrongPassword(value) <= 30) {
    //     throw new Error(
    //       "Make sure your password contains a lowercase, uppercase, number and symbol"
    //     );
    //   }
    // },
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  walletType: {
    type: String,
    enum: ["BTC", "BNB", "ETH"],
    default: "BNB",
  },

  walletAddress: {
    type: String,
    trim: true,
    min: [15, "invalid address"],
  },

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.virtual("deposit", {
  ref: "Deposit_txn",
  localField: "_id",
  foreignField: "owner",
});

userSchema.virtual("gridTrade", {
  ref: "Grid",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.authToken = async function () {
  const user = this;

  const getToken = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SIGN);
  const newToken = user.tokens.concat({ token: getToken });
  user.tokens = newToken;
  user.save();

  return getToken;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

userSchema.statics.findByCredentials = async (email, password) => {
  const emailExists = await User.findOne({ email });

  if (!emailExists) {
    throw new Error("Invalid Credetials");
  }
  const isValid = await bcrypt.compare(password, emailExists.password);

  if (!isValid) {
    throw new Error("Invalid Credentials");
  }
  return emailExists;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
