'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('job_listing', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('uuid_generate_v4'),
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      salary: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('open', 'closed', 'archived'),
        allowNull: false,
        defaultValue: 'open',
      },
      required_skills: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      employer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('job_listing');
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_job_listing_status";`);
  },
};
