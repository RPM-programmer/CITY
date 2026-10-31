const fs = require("fs");
const path = require("path");
const process = require("process");
const envPath = path.resolve(process.cwd(), ".env");
const logger = require("custom-color-logs").print;
const defaultEnvContent = `


# ==============================================================================
# MED-CMS (v1.2.0)
# ==============================================================================

# Специяльный тег инициализации (значение не меняйте)
MED_CMS_INITIALIZED                = true


# Код который будет хешироваться в куки
JWT_SECRET = "0000"


# Данные админа
# Почта админестратора
ADMIN_GMAIL = "x@gmail.com"

# Телефон админестратора
ADMIN_PHONE = "+375 00 00000000"

# Пароль аккаунта админестратора
ADMIN_PASSWORD = "1234"
`;

function initializeEnvironment() {
  try {
    if (!fs.existsSync(envPath)) {
      fs.writeFileSync(envPath, defaultEnvContent, "utf8");
    } else {
      const currentEnv = fs.readFileSync(envPath, "utf8");
      if (currentEnv.includes("MED_CMS_INITIALIZED")) {
        require("dotenv").config({ path: envPath });
        return;
      }
      fs.appendFileSync(envPath, `\n\n${defaultEnvContent}`, "utf8");
    }
  } catch (err) {
    console.log(
      logger.ServerMedError(
        "Не удалось проверить или обновить .env:",
        err.message,
      ),
    );
  }
  require("dotenv").config({ path: envPath });
}
initializeEnvironment();
module.exports = { envPath };
