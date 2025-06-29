module.exports = {
	up: async (queryInterface, Sequelize) => {
		const now = new Date();

		await queryInterface.bulkInsert('role', [
			{
				id: 1,
				name: 'admin',
				description: 'System administrator with full access',
				created_date_time: now,
				modified_date_time: now,
			},
			{
				id: 2,
				name: 'employer',
				description: 'Can post and manage jobs, review applications',
				created_date_time: now,
				modified_date_time: now,
			},
			{
				id: 3,
				name: 'candidate',
				description: 'Can search jobs and submit applications',
				created_date_time: now,
				modified_date_time: now,
			},
		]);
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('role', {
			name: ['admin', 'employer', 'candidate'],
		});
	},
};
