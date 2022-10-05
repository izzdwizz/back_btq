const mongoose = require("mongoose");


const depositTxnSchema = new mongoose.Schema({
  amount: {
    type: Number,
    defualt: 0,
    min: 500,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

  status: {
    type: String,
    required: [true, "Payment Status is required"],
    enum: ["Success", "pending", "failed"],
  },
});

const DepositTxn = mongoose.model("DepositTxn", depositTxnSchema);

module.exports = DepositTxn;
