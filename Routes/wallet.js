// const express = require("express");
// const Wallet = require("../Models/Wallet/Wallet");
// const Auth = require("../middlewares/auth");
// const User = require("../Models/User");
// const DepositTxns = require("../Models/Wallet/Deposit_txn");

// const router = new express.Router();

// router.post("/myprofile/wallet/deposit", Auth, async (req, res) => {
//   const { amount } = req.body;

//   if (typeof amount !== "number") {
//     res.status(400).send("error: amount must be a number");
//   }

//   const user = await User.findOne({ _id: req.user._id });

//   if (!user) {
//     res.status(400).send("No user found");
//   }

//   const wallet = await Wallet.findOne({ owner: user._id });
//   wallet.balance += amount;

//   try {
//     await wallet.save();

//     await DepositTxns.create({
//       owner: user._id,
//       amount,
//       status: "Success",
//       wallet: wallet.balance
//     });
//     res.status(200).send({ wallet });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// router.get("/wallet/balance", Auth, async (req, res) => {
//   const wallet = await Wallet.findOne({ owner: req.user._id });

//   try {
//     res.status(200).send({wallet: wallet.balance});
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// });

// router.post("/myprofile/lock-balances", Auth, async (req, res) => {
//   console.log(req.user._id);
//   // gets the value of trade
  
//   //funds that have been used in the grid trade should be locked
//   const wallet = await Wallet.findOne({ owner: req.user._id });
//   res.send(wallet);
//   console.log(wallet);
// });

// router.post("/myprofile/withdraw", Auth, async (req, res) => {
//   //getuser acct
//   const { amount } = req.body;
//   const wallet = await Wallet.findOne({ owner: req.user._id });

//   if (amount > wallet.balance) {
//     res.status(400).send("error: amount invalid ");
//   }

//    //if (trade is true) {
//    //throw new error cannot withdraw funds trade on going
//    //}

//   wallet.balance -= amount;
//   await DepositTxns.create({
//     owner: req.user._id,
//     amount,
//     status: "pending",
//   });
//   try {
//     await wallet.save();

//     res.status(201).send(wallet);
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }

// });

// //profit generated (percentage either 3 or 4 or 5) based pn invested could be random
// module.exports = router;
