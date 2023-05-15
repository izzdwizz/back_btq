const express = require('express');
const User = require('../Models/User');

const web3 = require('web3');
const auth = require('../middlewares/auth');
const { validate } = require('bitcoin-address-validation');
const { sendWelcomeMail, userSignInMail } = require('../emails/emails');
const sendVerifyCode = require('../emails/verifyEmail');
const { verifyEmail } = require('../middlewares/verifyMail');

const { verifyCode } = require('email-verification-code');

const router = new express.Router();

router.post('/register', async (req, res) => {
	const { username, email, password, walletType, walletAddress } = req.body;

	if (walletType === 'BNB' || walletType === 'ETH') {
		const checkAddress = web3.utils.isAddress(walletAddress);

		if (!checkAddress) {
			return res.status(400).send('Not a Valid address');
		}
	}

	if (walletType === 'BTC') {
		const checkAddress = validate(walletAddress);
		if (!checkAddress) {
			return res.status(400).send('Not a Valid BTC address');
		}
	}

	const checkUserEmail = await User.findOne({ email });
	const checkUsername = await User.findOne({ username });

	if (checkUsername) {
		return res.status(400).send({
			message: 'Username already exists',
		});
	}

	if (checkUserEmail) {
		return res.status(400).send({
			message: 'Email already exists',
		});
	}

	try {
		const user = await User.create({
			username,
			email,
			password,
			walletType,
			walletAddress,
		});
		sendWelcomeMail(user.email, user.username);
		const token = await user.authToken();

		res.status(201).send({ user, token });
	} catch (error) {
		res.status(400).send(error.keyValue);
	}
});

router.post('/getEmailVerificationCode', async (req, res, next) => {
	const sendEmailCode = req.body;
	const user = await User.findOne({ email: sendEmailCode.email });

	try {
		if (user?.isVerified) {
			next();
		}
		sendVerifyCode(user.email);
		res.status(200).send({ message: 'Verification Code sent successfully' });
	} catch (error) {
		res.status(500).send({ message: 'internal server error', error });
		console.log(error);
	}
});

router.post('/verifyCodeSent', async (req, res, next) => {
	const getDetails = req.body;
	const user = await User.findOne({ email: getDetails.email });

	if (user?.isVerified) {
		next();
	}

	try {
		const response = verifyCode(user.email, getDetails.code);

		if (response.error === false) {
			res.status(200).send('verification succesfully sent');
			user.isVerified = true;
			await user.save();
		} else {
			res.status(400).send(response.reason);
		}
	} catch (error) {
		res.status(500).send({ message: 'internal server error', error });
		console.log(error);
	}
});

router.post('/signIn', verifyEmail, async (req, res) => {
	try {
		const signInUser = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await signInUser.authToken();
		res.status(200).send({ signInUser, token });

		userSignInMail(signInUser.username, signInUser.email);
	} catch (error) {
		res.status(500).send(' sign in error ' + error.message);
	}
});

router.post('/logout', auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send('User logged out');
	} catch (error) {
		res.status(500).send(error.message || error);
	}
});

router.get('/myprofile', auth, async (req, res) => {
	const user = await req.user;
	try {
		res.status(200).send({ user });
	} catch (error) {
		res
			.status(401)
			.send({ message: 'Error, not found!', error: error.message });
	}
});

router.patch('/update', auth, async (req, res) => {
	const updateUser = Object.keys(req.body);
	const updateParams = ['email', 'password', 'walletType', 'walletAddress'];
	const isValidation = updateUser.every((update) =>
		updateParams.includes(update)
	);

	if (!isValidation) {
		return res.status(400).send({ error: 'update not allowed' });
	}

	try {
		const user = req.user;
		updateUser.forEach((update) => (user[update] = req.body[update]));
		await user.save();

		res.send(user);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

router.delete('/removeuser', auth, async (req, res) => {
	try {
		await req.user.remove();

		res.send(req.user);
	} catch (error) {
		res.send(500).send(error.message || error);
	}
});

module.exports = router;
