const { sendCode } = require("email-verification-code");

const sendVerifyCode = async (email) => {
    try {
 const data = {
    smtpInfo: {
      host: "smtp.gmail.com",
      port: 587,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    company: {
      name: "BitSquant.",
      email: process.env.EMAIL_USER,
    },
    mailInfo: {
      emailReceiver: email,
      subject: "Verify your email",
      text(code) {
        return `The Confirmation Code is: ${code}`;
      },
      html(code) {
        return `<p>The Confirmation Code is: ${code}</p>`;
      },
    },
  };

  return await sendCode(data);
    } catch (error) { 
        console.log({error})
    }
 
};

module.exports = sendVerifyCode;
