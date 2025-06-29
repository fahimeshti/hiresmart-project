module.exports = (sequelize, DataTypes) => {
	const role = sequelize.define(
		'role',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: true,
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
			tableName: 'role',
			timestamps: false,
		}
	);

	role.associate = (models) => {
		role.hasMany(models.user, {
			foreignKey: 'role_id',
			as: 'users',
			onDelete: 'CASCADE',
		});
	};

	return role;
};
