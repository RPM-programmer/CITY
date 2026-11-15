const path = require("path");
const logger = require("custom-color-logs").print;
module.exports = function init(app) {
  app.use((req, res, next) => {
    res.status(404);
    res.sendFile(path.join(__dirname, "plugs", "404", "plug2.html"));
  });
  app.use((err, req, res, next) => {
    console.log(logger.ServerError("Ошибка 500:", err.stack));
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.sendFile(path.join(__dirname, "plugs", "500", "plug1.html"));
  });
};
