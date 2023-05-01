const express = require("express");
const User = require("../Models/User");
const Auth = require("../middlewares/auth");
const Grid = require("../Models/trades/Grid");
const { tradePlacedMail } = require("../emails/emails");
const coinTicker = require("coin-ticker");
const Cryptr = require("cryptr");
const { verifyEmail } = require("../middlewares/verifyMail");

const router = new express.Router();
//  this gets the tradekey
router.post("/getTradeKey", Auth, async (req, res) => {
  const { tradeKey } = req.body;
  console.log(tradeKey)

  const cryptr = new Cryptr(process.env.TRADE_KEY, {
    pbkdf2Iterations: 10000,
    saltLength: 10,
  });
  const encryptedString = cryptr.encrypt(tradeKey);
  console.log(encryptedString)
  try {
    const user = await User.findOne({ _id: req.user._id });
    const trade = await Grid.create({
      username: user.username,
      email: user.email,
      owner: user._id,
      tradeKey: encryptedString,
    });
    res.status(200).send({ tradeKey: trade.tradeKey });
    tradePlacedMail(user.username, user.email);
  } catch (err) {
    res
      .status(500)
      .send({ message: "internal server error", error: err.message || err });
  }
});

router.get("/btcCurrentValue", async (req, res) => {
  console.log(req);

  try {
    const btcValue = await coinTicker("bitfinex", "BTC_USD").then((tick) => {
      return tick;
    });

    res.status(200).send({ Value: btcValue.last, btcValue });
  } catch (e) {
    res
      .status(500)
      .send({ message: "internal server error", error: e.message || e });
  }
});

module.exports = router;
