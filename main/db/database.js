const logger = require("custom-color-logs").print;
const path = require("path");
const Sequelize = require("sequelize");
const { canTreatArrayAsAnd } = require("sequelize/lib/utils");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "data.db"),
  logging: false,
});
const News = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  date: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

sequelize
  .sync()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => console.log(err));
async function create(title, text) {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const formattedDate = `${day}:${month}:${year}`; // Получится "14:11:26"

  return await News.create({
    date: formattedDate,
    title: title,
    text: text,
  });
}

async function getNews() {
  try {
    return await News.findAll({ raw: true }); // Добавлен return
  } catch (err) {
    console.log(
      logger.DatabaseError("Ошибка при поиске новостей", err.message),
    );
    return [];
  }
}

module.exports = { create, getNews };
