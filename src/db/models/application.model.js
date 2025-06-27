module.exports = (sequelize, DataTypes) => {
    const application = sequelize.define(
        'application',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            job_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'job_listing',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            candidate_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            cover_letter: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
                defaultValue: 'pending',
                allowNull: false,
            },
            created_date_time: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
            modified_date_time: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
        },
        {
            tableName: 'application',
            timestamps: false,
            uniqueKeys: {
                unique_application: {
                    fields: ['job_id', 'candidate_id'],
                },
            },
        }
    );

    application.associate = (models) => {
        application.belongsTo(models.user, {
            foreignKey: 'candidate_id',
            as: 'candidate',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        application.belongsTo(models.job_listing, {
            foreignKey: 'job_id',
            as: 'job',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return application;
};
