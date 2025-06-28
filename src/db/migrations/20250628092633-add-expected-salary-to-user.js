'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user', 'expected_salary', {
      type: Sequelize.DECIMAL,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user', 'expected_salary');
  }
};
