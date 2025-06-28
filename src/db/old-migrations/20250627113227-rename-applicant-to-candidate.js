'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('application', 'applicant_id', 'candidate_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('application', 'candidate_id', 'applicant_id');
  },
};
