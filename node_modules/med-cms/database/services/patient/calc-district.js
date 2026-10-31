const path = require("path");
// Импортируем строго синглтон базы данных для исключения круговой зависимости
const dbConfig = require(
  path.join(__dirname, "..", "..", "config", "db-init.js"),
);

const calcDistrict = {
  /**
   * Динамический поиск участка по названию улицы в таблице настроек админа
   */
  async determineLocation(clinicId, street) {
    const cleanedStreet = street.trim().toLowerCase();

    // Достаем проинициализированную модель Участков онлайн
    const District = dbConfig.models.District || dbConfig.District;

    if (!District) {
      console.log(
        "⚠️ [Med Module] Модель District еще не инициализирована в БД",
      );
      return {
        assignedDistrict: "Общий распределительный участок",
        assignedCabinet: "Кабинет №100 (Регистратура)",
      };
    }

    // Ищем все участки, закрепленные за данной клиникой в SQLite
    const districts = await District.findAll({ where: { ClinicId: clinicId } });

    // Проверяем, в какой из участков админ записал эту улицу
    for (const district of districts) {
      const streetsArray = district.coveredStreets
        .split(",")
        .map((s) => s.trim());

      if (streetsArray.includes(cleanedStreet)) {
        return {
          assignedDistrict: district.name,
          assignedCabinet: `${district.cabinet} (Врач: ${district.doctorName || "Не назначен"})`,
        };
      }
    }

    // Дефолтный вариант, если админ еще не добавил эту улицу в карту покрытия
    return {
      assignedDistrict: "Общий распределительный участок",
      assignedCabinet: "Кабинет №100 (Регистратура)",
    };
  },

  /**
   * Привязка адреса к пациенту с динамическим расчетом участка
   */
  async saveAddress(userId, addressData) {
    const { city, street, houseNumber, clinicId } = addressData;

    // Достаем модель адресов из базы
    const UserAddress = dbConfig.models.UserAddress || dbConfig.UserAddress;

    if (!city || !street || !houseNumber || !clinicId) {
      throw new Error(
        "Заполните обязательные поля: город, улица, дом, ID клиники прикрепления",
      );
    }

    // Вычисляем лечебный участок по динамической карте улиц из базы данных
    const { assignedDistrict, assignedCabinet } = await this.determineLocation(
      clinicId,
      street,
    );

    // Проверяем, обновляет ли пациент старый адрес или создает новый
    const existingAddress = await UserAddress.findOne({
      where: { UserId: userId },
    });

    if (existingAddress) {
      return await existingAddress.update({
        city,
        street,
        houseNumber,
        assignedDistrict,
        assignedCabinet,
      });
    }

    return await UserAddress.create({
      UserId: userId,
      city,
      street,
      houseNumber,
      assignedDistrict,
      assignedCabinet,
    });
  },
};

module.exports = calcDistrict;
