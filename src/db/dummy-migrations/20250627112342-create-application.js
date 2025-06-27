'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('application', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      job_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'job_listing',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      candidate_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      cover_letter: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending',
        allowNull: false,
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

    // Add a unique constraint to prevent duplicate applications
    await queryInterface.addConstraint('application', {
      fields: ['job_id', 'candidate_id'],
      type: 'unique',
      name: 'unique_job_candidate_pair',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('application');
  },
};
