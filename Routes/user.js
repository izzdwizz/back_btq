const express = require("express");
const User = require("../Models/User");
const web3 = require("web3");
const auth = require("../middlewares/auth");
const { validate } = require("bitcoin-address-validation");

const router = new express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password, walletType, wallet } = req.body;

  if (walletType === "BNB" || walletType === "ETH") {
    const checkAddress = web3.utils.isAddress(wallet);

    if (!checkAddress) {
      return res.status(400).send("Not a Valid address");
    }
  }

  if (walletType === "BTC") {
    const checkAddress = validate(wallet);
    if (!checkAddress) {
      return res.status(400).send("Not a Valid BTC address");
    }
  }

  try {
    const user = await User.create({
      username,
      email,
      password,
      walletType,
      wallet,
    });
    const token = await user.authToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

router.post("/signIn", async (req, res) => {
  try {
    const signInUser = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await signInUser.authToken();
    res.send({ signInUser, token });
  } catch (error) {
    res.status(500).send(error + " sign in error");
    console.log(error + " sign in error");
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/myprofile", auth, (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(401).send(error);
  }
});

router.patch("/update", auth, async (req, res) => {
  const updateUser = Object.keys(req.body);
  const updateParams = ["email", "password"];
  const isValidation = updateUser.every((update) =>
    updateParams.includes(update)
  );

  if (!isValidation) {
    return res.status(400).send({ error: "update not allowed" });
  }

  try {
    const user = req.user;
    updateUser.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/removeuser", auth, async (req, res) => {
  try {
    await req.user.remove();

    res.send(req.user);
  } catch (e) {
    res.send(500).send(e);
  }
});
//connect wallet
//deposit {
// get deposit amount
// check previous balance
// add current deposit to previous balance
//send new balance to user//}
//credit balances
//withdrawal
//lock balances
//check if the input exists in the database
//send a success message
module.exports = router;
