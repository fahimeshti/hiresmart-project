'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface) => {
        const now = new Date();

        const jobId = 'e8b8e450-9a87-4600-914f-3e8b7f958927';
        const candidateIds = [
            '035c8278-3b61-4bb4-9258-d444a51530c6',
            '6467b068-085a-472d-9e11-bce6e1e5298c',
        ];

        await queryInterface.bulkInsert('application', [
            {
                id: uuidv4(),
                job_id: jobId,
                candidate_id: candidateIds[0],
                cover_letter: 'I have 3 years of React experience and I love building clean UIs.',
                status: 'pending',
                created_date_time: now,
                modified_date_time: now,
            },
            {
                id: uuidv4(),
                job_id: jobId,
                candidate_id: candidateIds[1],
                cover_letter: 'As a frontend developer, I specialize in Tailwind and accessibility.',
                status: 'accepted',
                created_date_time: now,
                modified_date_time: now,
            },
        ]);
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('application', {
            job_id: 'e8b8e450-9a87-4600-914f-3e8b7f958927'
        });
    }
};
