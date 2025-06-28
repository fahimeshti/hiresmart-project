module.exports = (sequelize, DataTypes) => {
    const job_listing = sequelize.define(
        'job_listing',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            location: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            salary: {
                type: DataTypes.DECIMAL,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('open', 'closed', 'archived'),
                defaultValue: 'open',
                allowNull: false,
            },
            required_skills: {
                type: DataTypes.ARRAY(DataTypes.STRING),
            },
            employer_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
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
            tableName: 'job_listing',
            timestamps: false,
        }
    );

    job_listing.associate = (models) => {
        job_listing.belongsTo(models.user, {
            foreignKey: 'employer_id',
            as: 'employer',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        job_listing.hasMany(models.application, {
            foreignKey: 'job_id',
            as: 'applications',
            onDelete: 'CASCADE',
        });
    };

    return job_listing;
};
