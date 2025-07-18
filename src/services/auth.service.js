const httpStatus = require('http-status');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const { decryptData } = require('../utils/auth');

async function loginUserWithEmailAndPassword(req) {
	const { email, password } = req.body;
	const user = await userService.getUserByEmail(email);

	if (!user) {
		throw new ApiError(
			httpStatus.UNAUTHORIZED,
			'Invalid email or password'
		);
	}

	const isPasswordMatch = await decryptData(password, user.password);

	if (!isPasswordMatch) {
		throw new ApiError(
			httpStatus.UNAUTHORIZED,
			'Invalid email or password'
		);
	}

	delete user.password;
	return user;
}

module.exports = {
	loginUserWithEmailAndPassword,
};
