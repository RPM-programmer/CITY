const path = require("path");
const dbConfig = require(
  path.join(__dirname, "..", "..", "config", "db-init.js"),
);

const getSchedule = {
  async byDoctorId(doctorId) {
    if (!doctorId) throw new Error("ID врача не указан");

    // Достаем проинициализированные модели из синглтона
    const Appointment = dbConfig.models.Appointment || dbConfig.Appointment;
    const User = dbConfig.models.User || dbConfig.User;

    return await Appointment.findAll({
      where: { DoctorId: doctorId, status: "ожидается" },
      include: [
        {
          model: User,
          as: "Patient",
          attributes: ["id", "fullName", "email"],
        },
      ],
      order: [
        ["date", "ASC"],
        ["time", "ASC"],
      ],
    });
  },
};

module.exports = getSchedule;
