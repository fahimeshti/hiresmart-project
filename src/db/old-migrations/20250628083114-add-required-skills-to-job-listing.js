'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('job_listing', 'required_skills', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('job_listing', 'required_skills');
  }
};
