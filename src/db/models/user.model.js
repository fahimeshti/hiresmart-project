module.exports = (sequelize, DataTypes) => {
	const user = sequelize.define(
		'user',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
				},
			},
			skills: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				allowNull: true
			},
			expected_salary: {
				type: DataTypes.DECIMAL,
				allowNull: true,
			},
			role_id: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: 'role',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			password: {
				type: DataTypes.STRING,
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
			tableName: 'user',
			timestamps: false,
		}
	);

	user.associate = (models) => {
		user.belongsTo(models.role, {
			foreignKey: 'role_id',
			as: 'role',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		});
	};

	return user;
};
