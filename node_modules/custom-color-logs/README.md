# 🚀 custom-color-logs

> Продвинутая и гибкая система логирования для Node.js, которая превращает скучный вывод в терминале в структурированный и стильный инструмент мониторинга.

[![npm version](https://shields.io)](https://npmjs.com)
[<img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/3840px-Npm-logo.svg.png" height="20" align="center"> На npm](https://npmjs.com)
[<img src="https://raw.githubusercontent.com/primer/octicons/6220ff87f3ddd923b05ffdac7e2d9cb714213205/icons/law-16.svg" height="20" align="center"> License](LICENSE)

---

## ✨ Особенности
* 🎨 **Полная кастомизация:** Тонкая настройка цветов (через `chalk-palette`) и префиксов для каждого системного компонента.
* 📦 **Компонентная структура:** Изолированные пространства имен логов для `Server`, `Socket`, `Writter`, `Database` и `Nodemailer`.
* ⚡ **Performance-трекинг:** Специальные методы для красивой индикации быстрой или медленной работы функций.
* 🛡️ **Безопасность процессов:** Автоматический перехват критических ошибок `uncaughtException` и `unhandledRejection` с очисткой трейса от лишнего «мусора» Node.js.
* 💾 **Гарантия логирования:** Синхронная запись критических ошибок в файл `./logs/errors.log` до того, как упадет процесс.

---

## 📦 Установка

Вы можете установить модуль с помощью вашего любого пакетного менеджера:

```bash
npm install custom-color-logs
# или
yarn add custom-color-logs
```

---

## 💻 Пример использования и Тестирование

Для проверки того, как ваши стили и палитры выглядят вживую, вы можете использовать готовый скрипт-тестер. Подключите конфигурацию `.env` и выполните следующий код:

```javascript
const path = require('path');
const fs = require('fs');

// 1. Принудительно загружаем ваш .env, чтобы убедиться, что переменные доступны
require("dotenv").config();

// 2. Подключаем логгер
const { print } = require("custom-color-logs");

// Небольшая задержка, чтобы системные логи из вашего файла успели напечататься первыми
setTimeout(() => {
    console.log("\n" + "=".repeat(20) + " ТЕСТ ВАШИХ СТИЛЕЙ ИЗ .ENV " + "=".repeat(20) + "\n");

    // --- БАЗОВЫЕ СТАТУСЫ ---
    console.log(print.ServerInfo("Тестовое информационное сообщение сервера"));
    console.log(print.ServerWarn("Предупреждение: превышен лимит запросов"));
    console.log(print.ServerError({ message: "Критический сбой базы данных" }));
    console.log("-".repeat(60));

    // --- ФУНКЦИИ И СТАТУСЫ ---
    console.log(print.DatabaseFunctionInfo("authCheck", "Проверка сессии пользователя"));
    console.log(print.DatabaseFunctionStatus("authCheck", "Успешная авторизация (ID: 777)"));
    console.log(print.SocketFunctionPrint("emitEvent", "Отправка пакета всем активным клиентам"));
    console.log("-".repeat(60));

    // --- ПЕРФОРМАНС ---
    console.log(print.ServerFuctionPositivePerfomance("API_Request", "Время ответа в пределах нормы: 45ms"));
    console.log(print.ServerFunctionNegativePerfomance("DB_Backup", "ВНИМАНИЕ! Резервное копирование заняло 12.4с"));
    console.log("-".repeat(60));

    // --- СУГУБО NODEMAILER ---
    console.log(print.NodemailerFuctionPositiveSending("success-recipient@domain.com"));
    console.log(print.NodemailerFunctionNegativeSending("failed-mailbox@domain.com"));

    console.log("\n" + "=".repeat(23) + " КОНЕЦ ТЕСТИРОВАНИЯ " + "=".repeat(23) + "\n");

}, 100);
```

---

## 🛠 Гибкая настройка через `.env`

Логгер автоматически считывает настройки оформления из вашего файла окружения. Вы можете менять префиксы статусов и цвета (например, `Blue`, `Orange`, `Red`, `Lime`, `Green`, `Gray`):

```ini
# --- Управление поведением логов ---
SHOW_START_LOG                               = true
SHOW_MODULE_LOGS                             = false
SHOW_END_LOG                                 = true
SHOW_TIME_AT_LOG                             = true

# --- Основные статусы сообщений ---
INFO                                         = "@info"
INFO_COLOR                                   = "Blue"
WARNING                                      = "@warn"
WARNING_COLOR                                = "Orange"
ERROR                                        = "@error"
ERROR_COLOR                                  = "Red"

# --- Функции и логика компонентов ---
NAME_FUNCTION_COLOR                          = "Lime"
CUSTOM_TEXT_TO_FUNCTION_COLOR                = "Gray"
POSITIVE_COLOR                               = "Green"
NEGATIVE_COLOR                               = "Orange"
```

---

## 📂 Логирование сбоев (Error Logs)

При возникновении непредвиденной ошибки в коде вашего приложения логгер автоматически перехватит её, уберет лишние строки внутренних модулей Node.js (из `node_modules` и `node:internal`), после чего сформирует красивую запись в файле `./logs/errors.log`:

```text
------------------------------[ 05.09.2026, 20:15:30 ]------------------------------
TYPE: UNCAUGHT_EXCEPTION
MESSAGE: Критический сбой базы данных
STACK:
Error: Критический сбой базы данных
    at Object.<anonymous> (D:\project\test-logger.js:18:24)
------------------------------------------------------------------------------------
```

---

## 🛠 Разработка и тестирование (Development)

Для локального запуска и доработки проекта выполните следующие команды:

```bash
git clone https://github.com/RPM-programmer/custom-color-logs.git
cd custom-color-logs
npm install
node test.js
```

## 📄 Лицензия (License)

[MIT](LICENSE) © RPM-programmer
* [На GitHub](https://github.com/RPM-programmer)
* [На npm](https://www.npmjs.com/~prm-programmer)
