const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minute
	max: 20,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		code: 429,
		message: 'Too many requests, Please try again in 5 minute.',
	},
});


module.exports = {
	rateLimiter,
};
