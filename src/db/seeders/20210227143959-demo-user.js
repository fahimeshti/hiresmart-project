module.exports = {
	up: async (queryInterface, Sequelize) => {
		const now = new Date();
		const password = '$2b$10$ypGY2T4RSpZQ/uGrlKqqi.LfWwF.NQhP8Njq3h7cIlFvc.2O51oE.'

		await queryInterface.bulkInsert('user', [
			{
				id: "3c1ed328-cbef-4b41-acab-b90a8b830ce7",
				name: 'Admin User',
				email: 'admin@example.com',
				skills: null,
				expected_salary: null,
				preferred_location: null,
				role_id: 1, // admin
				password,
				is_verified: true,
				created_date_time: now,
				modified_date_time: now,
			},
			{
				id: "1b2ee1fe-cd9f-4402-bcb2-6a29f4ccb6c5",
				name: 'Employer User',
				email: 'employer@example.com',
				skills: null,
				expected_salary: null,
				preferred_location: null,
				role_id: 2, // employer
				password,
				is_verified: true,
				created_date_time: now,
				modified_date_time: now,
			},
			{
				id: "035c8278-3b61-4bb4-9258-d444a51530c6",
				name: 'Candidate User',
				email: 'candidate@example.com',
				skills: ['JavaScript', 'Node.js', 'React'],
				expected_salary: 70000,
				preferred_location: 'Remote',
				role_id: 3, // candidate
				password,
				is_verified: true,
				created_date_time: now,
				modified_date_time: now,
			},
			{
				id: "6467b068-085a-472d-9e11-bce6e1e5298c",
				name: 'Candidate User 2',
				email: 'candidate2@example.com',
				skills: ['React', 'TailwindCSS', 'JavaScript'],
				expected_salary: 80000,
				preferred_location: 'Remote',
				role_id: 3, // candidate
				password,
				is_verified: true,
				created_date_time: now,
				modified_date_time: now,
			}
		]);
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('user', {
			email: ['admin@example.com', 'employer@example.com', 'candidate@example.com'],
		});
	},
};
