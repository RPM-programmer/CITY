module.exports = (sequelize, DataTypes) => {
  const UserAddress = sequelize.define(
    "UserAddress",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      city: { type: DataTypes.STRING, allowNull: false },
      street: { type: DataTypes.STRING, allowNull: false },
      houseNumber: { type: DataTypes.STRING, allowNull: false },
      assignedDistrict: { type: DataTypes.STRING, allowNull: true },
      assignedCabinet: { type: DataTypes.STRING, allowNull: true },
    },
    {
      timestamps: true,
    },
  );

  UserAddress.associate = (models) => {
    UserAddress.belongsTo(models.User, {
      foreignKey: "UserId",
      onDelete: "CASCADE",
    });
  };

  return UserAddress;
};
