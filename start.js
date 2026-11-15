const server = require("./main/main.js");
const plug = require("./plug/plug.js");
const chalk = require("chalk-palette");
const animation = chalk.animation;
const BANK = require("sequelize-game-bank");
const MED = require("med-cms");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
(async () => {
  try {
    await MED(server);
    await delay(2000);
    await BANK(server);
    plug(server);
    server.listen(3000, "0.0.0.0", async () => {
      await delay(3000);
      await chalk.logoTextAnimation("CITY—CMS", {
        color: "blue",
        speed: 1.2,
        style: "forge",
      });
    });
  } catch (error) {
    console.error("Критическая ошибка инициализации сервера:", error);
    process.exit(1);
  }
})();
