module.exports = (sequelize, DataTypes) => {
  const Clinic = sequelize.define(
    "Clinic",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      type: {
        type: DataTypes.ENUM(
          "больница",
          "поликлиника",
          "станция скорой помощи",
          "частный медицинский центр",
        ),
        allowNull: false,
      },
      address: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: true },
    },
    {
      timestamps: true,
    },
  );

  // Настройка связи прямо в таблице клиник
  Clinic.associate = (models) => {
    Clinic.hasMany(models.User, { foreignKey: "ClinicId" });
  };

  return Clinic;
};
