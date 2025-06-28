'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('job_listing', 'status', {
      type: Sequelize.ENUM('open', 'closed', 'archived'),
      defaultValue: 'open',
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('job_listing', 'status');
  }
};
