const express = require('express');
const auth = require('../middlewares/auth');
const Premium = require('../Models/trades/Premium');
const User = require('../Models/User');
const {
	premiumPaymentPending,
	premiumPaymentConfirmedEmail,
	paymentOrderCreated,
} = require('../emails/emails');

const cron = require('node-cron');
const schedule = '*/0.5 * * * *';

const router = new express.Router();

router.post('/validate_premium', auth, async (req, res) => {
	const { transactionId, walletAddress, premiumType } = req.body;
	try {
		if (!transactionId && !walletAddress) {
			return res.status(400).send({
				message: 'Transaction ID and Wallet Address must be provided',
			});
		}

		const txnID = await Premium.findOne({ transactionId: transactionId });
		if (txnID) {
			res.status(402).send({ message: 'This transaction ID already exists' });
		}

		const premium = await Premium.create({
			username: req.user.username,
			email: req.user.email,
			owner: req.user._id,
			transactionId,
			walletAddress,
			premiumType,
			paymentStatus: 'Pending',
		});

		req.user.premium = 'Pending';
		await req.user.save();

		premiumPaymentPending(premium.username, premium.email)
			.then(async (info) => {
				if (info) {
					console.log(info);
				}
			})
			.catch((error) => {
				throw new Error(error);
			});
		paymentOrderCreated(premium.username);

		res.status(201).send({
			message: 'Payment Order has been created successfully.',
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: 'internal server error', error: error });
	}
});

cron.schedule(schedule, async () => {
	try {
		// Find9 the documents with payment set to true
		const premiumPayments = await Premium.find({ paymentConfirmed: true });

		for (const paymentConfirmed of premiumPayments) {
			if (
				!paymentConfirmed.isPremiumPaymentConfirmedEmailSent &&
				paymentConfirmed.paymentConfirmed
			) {
				premiumPaymentConfirmedEmail(
					paymentConfirmed.username,
					paymentConfirmed.email
				);

				paymentConfirmed.isPremiumPaymentConfirmedEmailSent = true;
				paymentConfirmed.paymentStatus = 'Active';

				await paymentConfirmed.save();

				await User.updateOne(
					{ _id: paymentConfirmed.owner },
					{
						$set: {
							premium: 'Active',
							premiumType: paymentConfirmed.premiumType,
						},
					}
				);
			} else {
				console.log('no pending payment confirmation');
			}
			// Iterate through the premium payments
			const currentDate = new Date();
			const paymentDate = paymentConfirmed.date;
			// Calculate the number of days since the payment was set to true
			// const daysSincePayment = Math.floor((currentDate - paymentDate) / (1000 * 60 * 60 * 24));
			// const secondsSincePayment = Math.floor((currentDate - paymentDate) / 1000);

			// const secondsInAYear = 365 * 24 * 60 * 60;

			const secondsSincePayment = Math.floor(
				(currentDate - paymentDate) / 1000
			);
			// If it has been 30 days, set payment to false
			if (
				secondsSincePayment >= 216 &&
				paymentConfirmed.premiumType === 'monthly'
			) {
				await Premium.updateOne(
					{ _id: paymentConfirmed._id },
					{ $set: { paymentConfirmed: false, paymentStatus: 'Inactive' } }
				);

				await User.updateOne(
					{ _id: paymentConfirmed.owner },
					{ $set: { premium: 'Inactive', premiumType: 'regular' } }
				);
			}

			if (
				secondsSincePayment >= 400 &&
				paymentConfirmed.premiumType === 'yearly'
			) {
				await Premium.updateOne(
					{ _id: paymentConfirmed._id },
					{ $set: { paymentConfirmed: false, paymentStatus: 'Inactive' } }
				);

				await User.updateOne(
					{ _id: paymentConfirmed.owner },
					{ $set: { premium: 'Inactive', premiumType: 'regular' } }
				);
			}
		}

		console.log('Cron job completed successfully!');
	} catch (error) {
		console.error('Error executing cron job:', error);
	}
});

module.exports = router;
