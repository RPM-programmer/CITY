// Полностью рабочий database/config/db-init.js с динамическим расширением модели

const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
const logger = require("custom-color-logs").print;

let sequelize;

function getSequelizeInstance(dbPath) {
  if (!sequelize) {
    const storagePath = dbPath || path.join(process.cwd(), "med-cms.sqlite");
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: storagePath,
      logging: false,
    });
  }
  return sequelize;
}

const db = {
  getSequelizeInstance,
  initDatabase,
  get sequelize() {
    return sequelize;
  },
  models: {},
};

async function initDatabase(dbPath) {
  const instance = getSequelizeInstance(dbPath);

  try {
    await instance.authenticate();
    console.log(
      logger.DatabaseMedInfo("Успешное подключение к SQLite через Sequelize."),
    );

    // 1. Инициализируем базовые модели из фабрик
    db.models.Clinic = db.Clinic = require(
      path.join(__dirname, "..", "models", "clinics"),
    )(instance, DataTypes);
    db.models.User = db.User = require(
      path.join(__dirname, "..", "models", "users"),
    )(instance, DataTypes);
    db.models.UserAddress = db.UserAddress = require(
      path.join(__dirname, "..", "models", "user-addresses"),
    )(instance, DataTypes);
    db.models.Disease = db.Disease = require(
      path.join(__dirname, "..", "models", "diseases"),
    )(instance, DataTypes);
    db.models.Appointment = db.Appointment = require(
      path.join(__dirname, "..", "models", "appointments"),
    )(instance, DataTypes);
    db.models.District = db.District = require(
      path.join(__dirname, "..", "models", "districts"),
    )(instance, DataTypes);
    db.models.News = db.News = require(
      path.join(__dirname, "..", "models", "news"),
    )(instance, DataTypes);
    // =========================================================================
    // 🔥 ДИНАМИЧЕСКИЙ ХАК: Расширяем модель User прямо в памяти до синхронизации!
    // =========================================================================

    // А) Принудительно внедряем колонку должностей (position), которой нет в файле
    db.User.rawAttributes.position = {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Пациент",
    };
    db.User.refreshAttributes(); // Заставляем Sequelize пересобрать схему модели

    // Б) Снимаем жесткие ограничения ENUM с поля specialty, превращая его в гибкую строку
    db.User.rawAttributes.specialty = {
      type: DataTypes.STRING,
      allowNull: true,
    };
    db.User.refreshAttributes(); // Синхронизируем изменения атрибутов

    // =========================================================================

    // 2. Безопасно запускаем связи (Associations) между всеми таблицами
    Object.keys(db.models).forEach((modelName) => {
      if (db.models[modelName].associate) {
        db.models[modelName].associate(db.models);
      }
    });

    // 3. Синхронизируем базу данных с учётом динамически добавленных полей
    await instance.sync({ alter: true });
    console.log(
      logger.DatabaseMedInfo(
        "Все таблицы базы данных успешно синхронизированы.",
      ),
    );
  } catch (error) {
    console.log(
      logger.DatabaseMedError("Ошибка инициализации базы данных:", error),
    );
    throw error;
  }
}

module.exports = db;
