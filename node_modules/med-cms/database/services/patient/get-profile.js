const path = require("path");
// Импортируем синглтон конфигурации базы данных
const dbConfig = require(
  path.join(__dirname, "..", "..", "config", "db-init.js"),
);

const getProfile = {
  /**
   * Собрать полное медицинское досье пациента для личного кабинета
   */
  async getFullData(patientId) {
    if (!patientId) {
      throw new Error("ID пациента не указан");
    }

    // Безопасно достаем проинициализированные модели
    const User = dbConfig.models.User || dbConfig.User;
    const UserAddress = dbConfig.models.UserAddress || dbConfig.UserAddress;
    const Appointment = dbConfig.models.Appointment || dbConfig.Appointment;
    const Disease = dbConfig.models.Disease || dbConfig.Disease;

    // 1. Ищем профиль пользователя с адресом
    const profile = await User.findByPk(patientId, {
      attributes: { exclude: ["password"] },
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
      ],
    });

    if (!profile) {
      throw new Error("Профиль пациента не найден в базе данных");
    }

    // 2. Находим всю историю приёмов с врачами и диагнозами (используем правильный alias PatientAppointments)
    const appointments = await Appointment.findAll({
      where: { PatientId: patientId },
      include: [
        {
          model: User,
          as: "Doctor",
          attributes: ["fullName", "specialty", "position"],
        },
        {
          model: Disease,
          attributes: [
            "name",
            "code",
            "treatmentRecommendations",
            "recommendedMedications",
          ],
        },
      ],
      order: [
        ["date", "DESC"],
        ["time", "DESC"],
      ],
    });

    return {
      personalInfo: profile,
      medicalHistory: appointments,
    };
  },
};

module.exports = getProfile;
