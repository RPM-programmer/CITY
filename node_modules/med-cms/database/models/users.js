module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: { type: DataTypes.STRING, allowNull: false },
      fullName: { type: DataTypes.STRING, allowNull: false },
      role: {
        type: DataTypes.ENUM("patient", "doctor", "admin"),
        defaultValue: "patient",
        allowNull: false,
      },
      specialty: {
        type: DataTypes.ENUM(
          "Терапевт",
          "Педиатр",
          "Врач общей практики",
          "Кардиолог",
          "Невролог",
          "Эндокринолог",
          "Гастроэнтеролог",
          "Пульмонолог",
          "Нефролог",
          "Ревматолог",
          "Гематолог",
          "Хирург",
          "Травматолог-ортопед",
          "Сосудистый хирург",
          "Нейрохирург",
          "Кардиохирург",
          "Пластический хирург",
          "Офтальмолог",
          "Отоларинголог",
          "Дерматолог",
          "Стоматолог",
          "Гинеколог",
          "Уролог",
          "Онколог",
          "Инфекционист",
          "Аллерголог-иммунолог",
          "Психиатр",
          "Психотерапевт",
          "Нарколог",
          "Анестезиолог-реаниматолог",
          "Рентгенолог",
          "Врач УЗД",
          "Эндоскопист",
          "Патологоанатом",
        ),
        allowNull: true,
      },
      isTemporaryPassword: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      timestamps: true,
    },
  );

  // Настройка связей пользователя
  User.associate = (models) => {
    User.belongsTo(models.Clinic, {
      foreignKey: "ClinicId",
      onDelete: "SET NULL",
    });
    User.hasOne(models.UserAddress, { foreignKey: "UserId" });
  };

  return User;
};
