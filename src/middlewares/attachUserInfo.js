const db = require("../db/models");


function attachUserInfo() {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.userId) {
                return next();
            }

            const user = await db.user.findByPk(req.user.userId, {
                include: [{ model: db.role, as: 'role' }],
            });

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = {
                userId: user.id,
                roleId: user.role_id,
                roleName: user.role.name.toLowerCase(),
                email: user.email,
            };

            next();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = attachUserInfo;
