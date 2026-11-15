const { log } = require("console");
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "state.json");

// Функция для чтения данных
function getGameState() {
  const rawData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(rawData);
}

// Функция для обновления данных
function updateGameState(newStatus, newTime, newDate) {
  // 1. Читаем текущее состояние
  const currentData = getGameState();

  // 2. Меняем нужные поля
  currentData.gameStatus = newStatus;
  currentData.game.time = newTime;
  currentData.game.date = newDate;

  // 3. Сохраняем обратно в файл (null, 2 делают красивые отступы)
  fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), "utf8");
}
module.exports.set = updateGameState;
module.exports.get = getGameState;
