const AccessControl = require('accesscontrol');

const ac = new AccessControl();

const roleIds = {
	ADMIN: 'admin',
	EMPLOYER: 'employer',
	CANDIDATE: 'candidate',
};

const resources = {
	USERINFO: 'user',
	ROLE: 'role',
	JOB: 'job',
	APPLICATION: 'application',
};

const grantsObject = {
	[roleIds.ADMIN]: {
		[resources.USERINFO]: {
			'create:any': ['*'],
			'read:any': ['*'],
			'update:any': ['*'],
			'delete:any': ['*'],
		},
		[resources.ROLE]: {
			'create:any': ['*'],
			'read:any': ['*'],
			'update:any': ['*'],
			'delete:any': ['*'],
		},
		[resources.JOB]: {
			'create:any': ['*'],
			'read:any': ['*'],
			'update:any': ['*'],
			'delete:any': ['*'],
		},
		[resources.APPLICATION]: {
			'read:any': ['*'],
			'delete:any': ['*'],
		},
	},
	[roleIds.EMPLOYER]: {
		[resources.JOB]: {
			'create:own': ['*'],
			'read:own': ['*'],
			'update:own': ['*'],
			'delete:own': ['*'],
		},
		[resources.APPLICATION]: {
			'read:own': ['*'],
		},
	},
	[roleIds.CANDIDATE]: {
		[resources.USERINFO]: {
			'read:own': ['*'],
			'update:own': ['*'],
		},
		[resources.APPLICATION]: {
			'create:own': ['*'],
			'read:own': ['*'],
			'delete:own': ['*'],
		},
	},
};

const roles = (function () {
	ac.setGrants(grantsObject);
	return ac;
})();

module.exports = {
	roles,
	roleIds,
	resources,
};
