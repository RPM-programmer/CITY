module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define(
    "Appointment",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      time: { type: DataTypes.STRING, allowNull: false },
      status: {
        type: DataTypes.ENUM("ожидается", "завершен", "отменен"),
        defaultValue: "ожидается",
        allowNull: false,
      },
      complaints: { type: DataTypes.TEXT, allowNull: true },
      objectively: { type: DataTypes.TEXT, allowNull: true },
      doctorNotes: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      timestamps: true,
    },
  );

  Appointment.associate = (models) => {
    Appointment.belongsTo(models.User, {
      as: "Patient",
      foreignKey: "PatientId",
      onDelete: "CASCADE",
    });
    Appointment.belongsTo(models.User, {
      as: "Doctor",
      foreignKey: "DoctorId",
      onDelete: "CASCADE",
    });
    Appointment.belongsTo(models.Disease, {
      foreignKey: "DiseaseId",
      onDelete: "SET NULL",
    });
  };

  return Appointment;
};
