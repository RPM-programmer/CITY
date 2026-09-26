const fs = require('fs');
const path = require('path');
const process = require('process');

// Определяем путь к .env файлу в корне проекта пользователя
const envPath = path.resolve(process.cwd(), '.env');

// Дефолтный блок настроек с уникальным маркером безопасности
const defaultEnvContent = `# ==============================================================================
# 🎨 CUSTOM-COLOR-LOGS CONFIGURATION (v2.0.0)
# ==============================================================================
CUSTOM_COLOR_LOGS_INITIALIZED                = true

SHOW_START_LOG                               = true
SHOW_MODULE_LOGS                             = false
SHOW_END_LOG                                 = true
SHOW_TIME_AT_LOG                             = true

AND                                          = " "
AND_COLOR                                    = Black
TO                                           = ":"
TO_COLOR                                     = Blue
COLOR                                        = Gray
TIME_COLOR                                   = White

INFO                                         = "@info"
INFO_COLOR                                   = Blue
WARNING                                      = "@warn"
WARNING_COLOR                                = Orange
ERROR                                        = "@error"
ERROR_COLOR                                  = Red
CUSTOM_ERROR_MESSAGE                         = "Error!"
CUSTOM_ERROR_MESSAGE_COLOR                   = Orange

FUNCTION_INFO                                = "@function-info"
FUNCTION_INFO_COLOR                          = Blue
NAME_FUNCTION_COLOR                          = Lime
CUSTOM_TEXT_TO_FUNCTION_COLOR                = Gray
LOG                                          = "@function-log"
LOG_COLOR                                    = Blue
STATUS                                       = "@function-status"
STATUS_COLOR                                 = Blue

POSITIVE                                     = "@function-positive-performance"
POSITIVE_COLOR                               = Green
PNAME_COLOR                                  = Lime
NEGATIVE                                     = "@function-negative-performance"
NEGATIVE_COLOR                               = Orange
NNAME_COLOR                                  = Lime

POSITIVE_SEND                                = "@send-status-true"
POSITIVE_SEND_COLOR                          = Green
NEGATIVE_SEND                                = "@send-status-false"
NEGATIVE_SEND_COLOR                          = Orange
GMAIL_COLOR                                  = Lime

MODULE_TEXT                                  = "[ LOGGER ]"
MODULE_TEXT_COLOR                            = SkyBlue
SERVER_TEXT                                  = "SERVER"
SERVER_TEXT_COLOR                            = Blue
SOCKET_TEXT                                  = "SOCKET"
SOCKET_TEXT_COLOR                            = Blue
WRITTER_TEXT                                 = "WRITTER"
WRITTER_TEXT_COLOR                           = Blue
DATABASE_TEXT                                = "DATABASE"
DATABASE_TEXT_COLOR                          = Green
NODEMAILER_TEXT                              = "NODEMAILER"
NODEMAILER_TEXT_COLOR                        = Purple
MODULES_TEXT                                 = "NODE-MODULES"
MODULES_TEXT_COLOR                           = Lime

CUSTOM_MODULE_START_MESSAGE                  = "Code is ran!"
CUSTOM_MODULES_START_MESSAGE                 = "Module is ran!"
CUSTOM_MODULES_START_MESSAGE_IF_ISNT_MODULES = "No active neighbor modules found."
CUSTOM_MODULES_START_MESSAGE_COLOR           = Gray
CUSTOM_MODULE_STOP_MESSAGE                   = "Code is stop!"
CUSTOM_MODULES_STOP_MESSAGE                  = "Module is stoped!"
CUSTOM_MODULES_STOP_MESSAGE_IF_ISNT_MODULES  = "No active neighbor modules found."
CUSTOM_MODULES_STOP_MESSAGE_COLOR           = Gray
`;

function initializeEnvironment() {
    try {
        if (!fs.existsSync(envPath)) {
            // Если .env файла нет совсем — создаем и записываем дефолтный конфиг с тегом
            fs.writeFileSync(envPath, defaultEnvContent, 'utf8');
        } else {
            // Если файл есть, читаем его содержимое
            const currentEnv = fs.readFileSync(envPath, 'utf8');
            
            // СТРОГАЯ ПРОВЕРКА ТЕГА: если маркер инициализации уже внутри файла, полностью выходим
            if (currentEnv.includes('CUSTOM_COLOR_LOGS_INITIALIZED')) {
                require("dotenv").config({ path: envPath });
                return;
            }
            
            // Если тега нет (конфиг логгера еще не добавлялся), аккуратно дописываем в конец
            fs.appendFileSync(envPath, `\n\n${defaultEnvContent}`, 'utf8');
        }
    } catch (err) {
        console.error('⚠️ [custom-color-logs] Не удалось проверить или обновить .env:', err.message);
    }

    // Загружаем обновленные или созданные переменные в process.env
    require("dotenv").config({ path: envPath });
}

initializeEnvironment();

module.exports = { envPath };