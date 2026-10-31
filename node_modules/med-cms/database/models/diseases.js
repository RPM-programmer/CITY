module.exports = (sequelize, DataTypes) => {
  const Disease = sequelize.define(
    "Disease",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      code: { type: DataTypes.STRING, allowNull: false, unique: true },
      treatmentRecommendations: { type: DataTypes.TEXT, allowNull: true },
      recommendedMedications: { type: DataTypes.TEXT, allowNull: true },
      casesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    },
  );

  // У этой модели нет прямых исходящих связей (зависит от Appointment, но связь прописана там)
  return Disease;
};
