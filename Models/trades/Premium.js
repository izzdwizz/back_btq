const mongoose = require('mongoose');

const premiumSchema = new mongoose.Schema({
	paymentStatus: {
		type: String,
		enum: ['Active', 'Pending', 'Inactive', 'failed'],
		default: 'Inactive',
	},

	paymentConfirmed: {
		type: Boolean,
		default: false,
	},

	premiumType: {
		type: String,
		enum: ['monthly', 'yearly', 'regular'],
	},
	isPremiumPaymentConfirmedEmailSent: {
		type: Boolean,
		default: false,
	},

	username: {
		type: String,
	},

	email: {
		type: String,
	},

	transactionId: {
		type: String,
	},

	walletAddress: {
		type: String,
	},

	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},

	date: {
		type: Date,
		default: Date.now,
	},
});

const Premium = mongoose.model('Premium', premiumSchema);
module.exports = Premium;
