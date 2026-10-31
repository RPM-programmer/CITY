const path = require("path");
const dbConfig = require(
  path.join(__dirname, "..", "..", "config", "db-init.js"),
);

const patientAccess = {
  async getHistory(patientId) {
    if (!patientId) throw new Error("ID пациента не указан");

    const User = dbConfig.models.User || dbConfig.User;
    const Appointment = dbConfig.models.Appointment || dbConfig.Appointment;
    const Disease = dbConfig.models.Disease || dbConfig.Disease;
    const UserAddress = dbConfig.models.UserAddress || dbConfig.UserAddress;

    return await User.findByPk(patientId, {
      attributes: ["id", "fullName", "email"],
      include: [
        {
          model: UserAddress,
          attributes: [
            "city",
            "street",
            "houseNumber",
            "assignedDistrict",
            "assignedCabinet",
          ],
        },
        {
          model: Appointment,
          as: "PatientAppointments",
          where: { status: "завершен" },
          include: [{ model: Disease, attributes: ["name", "code"] }],
          required: false,
        },
      ],
      order: [
        [{ model: Appointment, as: "PatientAppointments" }, "date", "DESC"],
      ],
    });
  },
};

module.exports = patientAccess;
