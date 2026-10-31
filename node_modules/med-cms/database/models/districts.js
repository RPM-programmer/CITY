module.exports = (sequelize, DataTypes) => {
  const District = sequelize.define(
    "District",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING, // Например: "Терапевтический участок №3"
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING, // Например: "Минск"
        allowNull: false,
      },
      street: {
        type: DataTypes.STRING, // Например: "Машерова"
        allowNull: false,
        set(value) {
          this.setDataValue("street", value.toLowerCase().trim());
        },
      },
      // Диапазон обслуживаемых домов (например: "1-20" или "все")
      houses: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "все",
      },
      cabinet: {
        type: DataTypes.STRING, // Например: "Кабинет №302"
        allowNull: false,
      },
      doctorName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Врач не назначен",
      },
    },
    {
      timestamps: true,
    },
  );

  District.associate = (models) => {
    // ЖЕСТКАЯ ПРИВЯЗКА: Участок и его кабинет принадлежат конкретному учреждению
    District.belongsTo(models.Clinic, {
      foreignKey: "ClinicId",
      onDelete: "CASCADE",
    });
  };

  return District;
};
