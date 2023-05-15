const nodemailer = require('nodemailer');
const moment = require('moment');

let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

const sendWelcomeMail = async (email, user) => {
	let userInfo = {
		from: '"BITSQUANT Trading 📈" <taskappdemo1@gmail.com>', // sender address
		to: email, // list of receivers
		subject: 'Hello WELCOME TO BIT ✔', // Subject line
		text: `Hello esteemd ${user} welcome to bitboy how are you? concat your text here`, // plain text body
		html: `<b>Hello esteemd ${user} welcome to bitboy how are you? concat your text here</b>`, // html body
	};

	transporter.sendMail(userInfo, (err) => {
		if (err) {
			throw new Error(err);
		} else {
			console.log('email sent');
		}
	});
};

const userSignInMail = (user, email) => {
	let userInfo = {
		from: '"Bts 📈" <taskappdemo1@gmail.com>', // sender address
		to: email, // list of receivers
		subject: 'You signed in ✔ ', // Subject line
		text: `Dear ${user} you have successfully signed in from location here`, // plain text body
		html: `<b>Dear ${user} you signed into your account on ${moment().format(
			'DD-MM-YYYY HH:mm'
		)} More from BTs?</b>`, // html body
	};

	transporter.sendMail(userInfo, (err) => {
		if (err) {
			throw new Error(err);
		} else {
			console.log('email sent');
		}
	});
};

const tradePlacedMail = (user, email, trade) => {
	let userInfo = {
		from: '"Bts 📈" <taskappdemo1@gmail.com>', // sender address
		to: email, // list of receivers
		subject: 'Trade succesfully placed ✔ ', // Subject line
		text: `Dear ${user} you have successfully placeD -- TRADE`, // plain text body
		html: '<b>view trade below?</b>', // html body
	};

	transporter.sendMail(userInfo, (err) => {
		if (err) {
			throw new Error(err);
		} else {
			console.log('email sent');
		}
	});
};

const premiumPaymentPending = (user, email) => {
	return new Promise((resolve, reject) => {
		let userInfo = {
			from: '"Bts 📈" <taskappdemo1@gmail.com>', // sender address
			to: email, // list of receivers
			subject: 'Trade succesfully placed ✔ ', // Subject line
			text: `Dear ${user} your order for premium is pending`, // plain text body
			html: '<b>view order below!</b>', // html body
		};

		transporter.sendMail(userInfo, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve('email sent');
			}
		});
	});
};

const premiumPaymentConfirmedEmail = (user, email) => {
	let userInfo = {
		from: '"Bts 📈" <taskappdemo1@gmail.com>', // sender address
		to: email, // list of receivers
		subject: 'Your Payment has been confirmed ✔ ', // Subject line
		text: `Dear ${user} your order for premium has been confirmed`, // plain text body
		html: `<b>Dear ${user} your order for premium has been confirmed - please visit our website to enjoy the benefits of our trading bots.</b>`, // html body
	};

	transporter.sendMail(userInfo, (err) => {
		if (err) {
			throw new Error(err);
		} else {
			console.log('email sent');
		}
	});
};
const paymentOrderCreated = (user) => {
	let userInfo = {
		from: '"Bts 📈" <taskappdemo1@gmail.com>', // sender address
		to: process.env.ADMIN_EMAIL, // list of receivers
		subject: 'A payment order has been created✔ ', // Subject line
		text: `Dear Admin please check the db for a payment order`, // plain text body
		html: `<b>Dear admin, ${user} just created a payment order please confirm from the db.</b>`, // html body
	};

	transporter.sendMail(userInfo, (err) => {
		if (err) {
			throw new Error(err);
		} else {
			console.log('email sent');
		}
	});
};

module.exports = {
	sendWelcomeMail,
	userSignInMail,
	tradePlacedMail,
	premiumPaymentPending,
	premiumPaymentConfirmedEmail,
	paymentOrderCreated,
};
