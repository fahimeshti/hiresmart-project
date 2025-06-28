const httpStatus = require('http-status');
const { getOffset } = require('../utils/query');
const ApiError = require('../utils/ApiError');
const { encryptData } = require('../utils/auth');
const config = require('../config/config.js');
const db = require('../db/models');
const roleService = require('./role.service');

async function getUserByEmail(email) {
	const user = await db.user.findOne({
		where: { email },
		include: [
			{
				model: db.role,
				required: true,
				as: 'role',
				attributes: [],
			},
		],
		attributes: { exclude: ['role_id'] },
		raw: true,
	});

	return user;
}

async function createUser(req) {
	const { email, name, password, roleId } = req.body;
	const hashedPassword = await encryptData(password);
	const user = await getUserByEmail(email);

	if (user) {
		throw new ApiError(httpStatus.CONFLICT, 'This email already exits');
	}

	const role = await roleService.getRoleById(roleId);
	
	if (!role) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
	}

	const allowedRoles = ['employer', 'candidate'];
	if (!allowedRoles.includes(role.name.toLowerCase())) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot register with this role');
	}

	const createdUser = await db.user
		.create({
			name,
			email,
			role_id: roleId,
			password: hashedPassword,
		})
		.then((resultEntity) => resultEntity.get({ plain: true }));

	return createdUser;
}

async function deleteUserById(userId) {
	const deletedUser = await db.user.destroy({
		where: { id: userId },
	});

	if (!deletedUser) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}

	return deletedUser;
}

async function updateUser(req) {
	const { password, email } = req.body;

	if (password) {
		const hashedPassword = await encryptData(password);

		if (!hashedPassword) {
			throw new ApiError(
				httpStatus.INTERNAL_SERVER_ERROR,
				'Internal Server Error'
			);
		}

		req.body.password = hashedPassword;
	}

	if (email) {
		const existedUser = await getUserByEmail(email);

		if (existedUser) {
			throw new ApiError(
				httpStatus.CONFLICT,
				'This email is already exist'
			);
		}
	}

	const updatedUser = await db.user
		.update(
			{ ...req.body },
			{
				where: { id: req.params.userId || req.body.id },
				returning: true,
				plain: true,
				raw: true,
			}
		)
		.then((data) => data[1]);

	return updatedUser;
}

module.exports = {
	getUserByEmail,
	createUser,
	updateUser,
	deleteUserById,
};
