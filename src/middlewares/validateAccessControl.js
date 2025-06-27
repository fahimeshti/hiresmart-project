const httpStatus = require('http-status');
const { roles } = require('../config/roles');
const ApiError = require('../utils/ApiError');

function grantAccess(action, resource) {
	return async (req, _res, next) => {
		try {
			const isOwnedUser = req.user.userId == req.params.userId;
			const modifiedAction = isOwnedUser
				? action.replace('Any', 'Own')
				: action;

			const roleName = req.user.roleName;

			if (!roleName) {
				throw new ApiError(httpStatus.UNAUTHORIZED, 'Missing role information');
			}

			const permission = roles
				.can(roleName)
			[modifiedAction](resource);

			if (!permission.granted) {
				throw new ApiError(
					httpStatus.FORBIDDEN,
					"You don't have enough permission to perform this action"
				);
			}
			next();
		} catch (error) {
			next(error);
		}
	};
}

module.exports = { grantAccess };
