const path = require("path");
const dbConfig = require(
  path.join(__dirname, "..", "..", "config", "db-init.js"),
);

const createClinic = {
  async create(clinicData) {
    const Clinic = dbConfig.models.Clinic || dbConfig.Clinic;
    const { name, type, address, phone } = clinicData;

    if (!name || !type || !address) {
      throw new Error("Поля name, type и address обязательны для заполнения");
    }

    const candidate = await Clinic.findOne({ where: { name } });
    if (candidate) {
      throw new Error(
        "Медицинское учреждение с таким названием уже зарегистрировано",
      );
    }

    return await Clinic.create({ name, type, address, phone });
  },

  async getAll() {
    const Clinic = dbConfig.models.Clinic || dbConfig.Clinic;
    return await Clinic.findAll({ order: [["name", "ASC"]] });
  },
};

module.exports = createClinic;
