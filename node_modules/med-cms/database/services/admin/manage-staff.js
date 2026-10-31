const path = require("path");
const dbConfig = require(
  path.join(__dirname, "..", "..", "config", "db-init.js"),
);

// ИСПРАВЛЕНИЕ: Добавляем точный импорт вашей библиотеки bcrypt
const bcrypt = require("bcrypt");

const manageStaff = {
  async createAccount(staffData) {
    const User = dbConfig.models.User || dbConfig.User;
    const Clinic = dbConfig.models.Clinic || dbConfig.Clinic;

    const { email, rawPassword, fullName, medicalProfile } = staffData;
    const ClinicId = staffData.ClinicId || staffData.clinicId;

    if (!email || !rawPassword || !fullName || !medicalProfile || !ClinicId) {
      throw new Error(
        "Необходимо заполнить обязательные поля: email, rawPassword, fullName, medicalProfile, clinicId",
      );
    }

    const clinicExists = await Clinic.findByPk(ClinicId);
    if (!clinicExists) {
      throw new Error(`Медицинское учреждение с ID №${ClinicId} не найдено.`);
    }

    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      throw new Error("Сотрудник с таким email уже зарегистрирован");
    }

    // Хешируем временный пароль с помощью подключенного нативного bcrypt
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    let finalPosition = "Врач";
    let finalSpecialty = medicalProfile;
    const purePositions = [
      "Главврач",
      "Медсестра",
      "Врач скорой помощи",
      "Фельдшер",
      "Регистратор",
    ];

    if (purePositions.includes(medicalProfile)) {
      finalPosition = medicalProfile;
      finalSpecialty = "Общий медицинский профиль";
    }

    return await User.create({
      email,
      password: hashedPassword,
      fullName,
      role: "doctor",
      position: finalPosition,
      specialty: finalSpecialty,
      ClinicId: Number(ClinicId),
      isTemporaryPassword: true,
    });
  },

  async deleteAccount(userId) {
    const User = dbConfig.models.User || dbConfig.User;
    const deletedRows = await User.destroy({ where: { id: userId } });
    if (deletedRows === 0) throw new Error("Аккаунт не найден");
    return { success: true, message: "Аккаунт успешно удален" };
  },
};

module.exports = manageStaff;
