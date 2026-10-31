const path = require("path");
// Импортируем только синглтон конфигурации базы данных
const dbConfig = require(
  path.join(__dirname, "..", "..", "config", "db-init.js"),
);

const dbAnalytics = {
  /**
   * Собрать общую медицинскую статистику и данные для дашборда
   */
  async getStats() {
    // Безопасно достаем проинициализированные фабриками модели онлайн
    const Clinic = dbConfig.models.Clinic || dbConfig.Clinic;
    const User = dbConfig.models.User || dbConfig.User;
    const Disease = dbConfig.models.Disease || dbConfig.Disease;
    const Appointment = dbConfig.models.Appointment || dbConfig.Appointment;

    if (!Clinic || !User || !Disease || !Appointment) {
      throw new Error(
        "Критическая ошибка: Модели базы данных еще не проинициализированы!",
      );
    }

    // Собираем агрегированные цифры для карточек админки через Sequelize
    const totalClinics = await Clinic.count();
    const totalPatients = await User.count({ where: { role: "patient" } });
    const totalStaff = await User.count({ where: { role: "doctor" } });
    const totalAppointments = await Appointment.count();

    // Топ-5 самых частых болезней по инкрементируемому счетчику
    const topDiseases = await Disease.findAll({
      limit: 5,
      order: [["casesCount", "DESC"]],
      attributes: ["name", "code", "casesCount"],
    });

    // Разбивка персонала по специальностям (для графиков или таблиц)
    const staffBySpecialty = await User.findAll({
      where: { role: "doctor" },
      attributes: [
        "specialty",
        [User.sequelize.fn("COUNT", User.sequelize.col("id")), "count"],
      ],
      group: ["specialty"],
    });

    return {
      summary: {
        totalClinics,
        totalPatients,
        totalStaff,
        totalAppointments,
      },
      topDiseases,
      staffBySpecialty,
    };
  },
};

module.exports = dbAnalytics;
