'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('uuid_generate_v4'),
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      skills: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      expected_salary: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      preferred_location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      role_id: {
        type: Sequelize.INTEGER, // Adjusted for your role.id now being INTEGER
        allowNull: false,
        references: {
          model: 'role',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_date_time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      modified_date_time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user');
  },
};
