const User = require('..Models/User');

const verifyPremium = async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.user.email });
		if (!user) {
			res.status(404).send({
				e: 'User not found',
			});
		}

		if (user.premium) {
			next();
		}

		if (!user.premium) {
			res.status(403).send({
				error: 'This user is not a premium user',
			});
		}
	} catch (error) {
		res.status(400).send({
			error: 'Bad Request',
		});
	}
};

module.exports = verifyPremium;
