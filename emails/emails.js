const nodemailer = require("nodemailer");
const moment = require("moment");


let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeMail = async (email, user) => {
  let userInfo = {
    from: '"BITSQUANT Trading 📈" <taskappdemo1@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Hello WELCOME TO BIT ✔", // Subject line
    text: `Hello esteemd ${user} welcome to bitboy how are you? concat your text here`, // plain text body
    html: `<b>Hello esteemd ${user} welcome to bitboy how are you? concat your text here</b>`, // html body
  };

  transporter.sendMail(userInfo, (err) => {
    if (err) {
      throw new Error(err);
    } else {
      console.log("email sent");
    }
  });
};

const userSignInMail = (user, email) => {
  let userInfo = {
    from: '"Bts 📈" <taskappdemo1@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "You signed in ✔ ", // Subject line
    text: `Dear ${user} you have successfully signed in from location here`, // plain text body
    html: `<b>Dear ${user} you signed into your account on ${moment().format(
      "DD-MM-YYYY HH:mm"
    )} More from BTs?</b>`, // html body
  };

  transporter.sendMail(userInfo, (err) => {
    if (err) {
      throw new Error(err);
    } else {
      console.log("email sent");
    }
  });
};

const tradePlacedMail = (user, email, trade) => {
  let userInfo = {
    from: '"Bts 📈" <taskappdemo1@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Trade succesfully placed ✔ ", // Subject line
    text: `Dear ${user} you have successfully placeD -- TRADE`, // plain text body
    html: "<b>view trade below?</b>", // html body
  };

  transporter.sendMail(userInfo, (err) => {
    if (err) {
      throw new Error(err);
    } else {
      console.log("email sent");
    }
  });
};

module.exports = {
  sendWelcomeMail,
  userSignInMail,
  tradePlacedMail,
};
