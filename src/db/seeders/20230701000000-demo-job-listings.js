'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface) => {
        const now = new Date();
        const employerId = "1b2ee1fe-cd9f-4402-bcb2-6a29f4ccb6c5"

        await queryInterface.bulkInsert('job_listing', [
            {
                id: "e8b8e450-9a87-4600-914f-3e8b7f958927",
                title: 'Frontend Developer',
                description: 'Looking for an experienced frontend engineer proficient in React and Tailwind.',
                location: 'New York',
                salary: 85000,
                status: 'open',
                required_skills: ['React', 'TailwindCSS', 'JavaScript'],
                employer_id: employerId,
                created_date_time: now,
                modified_date_time: now,
            },
            {
                id: uuidv4(),
                title: 'Backend Developer',
                description: 'Seeking a backend Node.js developer familiar with PostgreSQL and Redis.',
                location: 'Remote',
                salary: 95000,
                status: 'open',
                required_skills: ['Node.js', 'PostgreSQL', 'Redis'],
                employer_id: employerId,
                created_date_time: now,
                modified_date_time: now,
            },
            {
                id: uuidv4(),
                title: 'Full Stack Engineer',
                description: 'Join our team as a full stack engineer working on exciting startup projects.',
                location: 'San Francisco',
                salary: 105000,
                status: 'open',
                required_skills: ['React', 'Node.js', 'Express', 'MongoDB'],
                employer_id: employerId,
                created_date_time: now,
                modified_date_time: now,
            },
        ]);
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('job_listing', null, {});
    }
};
