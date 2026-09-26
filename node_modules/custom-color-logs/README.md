# 🚀 custom-color-logs

> Продвинутая и гибкая система логирования для Node.js, которая превращает скучный вывод в терминале в структурированный, полностью безопасный и стильный инструмент мониторинга.

[<img src="https://img.icons8.ru/?size=100&id=24895&format=png&color=000000" height="60" align="center"> npm versions](https://www.npmjs.com/package/custom-color-logs?activeTab=versions)
[<img src="https://img.icons8.ru/?size=100&id=24895&format=png&color=000000" height="60" align="center"> На npm](https://www.npmjs.com/package/custom-color-logs)
[<img src="https://img.icons8.ru/?size=100&id=12599&format=png&color=000000" height="60" align="center"> На GitHub](LICENSE)
[<img src="https://img.icons8.ru/?size=100&id=dvsOEzqniDma&format=png&color=000000" height="60" align="center"> License](LICENSE)

---

## ✨ Особенности v2.0.0
* ⚙️ **Автогенерация конфигурации:** Модуль сам создаёт файл `.env` с красивой палитрой при первом запуске или аккуратно дописывает настройки в конец вашего существующего `.env`.
* 🔒 **Защита от дублирования:** Благодаря уникальному внутреннему маркеру безопасности `CUSTOM_COLOR_LOGS_INITIALIZED`, конфигурационные строки записываются строго один раз и не дублируются при перезапусках.
* 🎨 **Полная кастомизация:** Тонкая настройка цветов (через `chalk-palette`) и префиксов для каждого системного компонента.
* 🛡️ **Абсолютная отказоустойчивость:** Больше никаких падений `TypeError: chalk[...] is not a function`. Если цвет в `.env` не задан, логгер безопасно выведет стандартный текст.
* 🔤 **Регистронезависимость:** Цвета автоматически преобразуются в CamelCase (например, `skyblue` станет `SkyBlue`), как требует `chalk-palette`.
* 📦 **Компонентная структура:** Изолированные пространства имен логов для `Server`, `Socket`, `Writter`, `Database` и `Nodemailer`.
* ⚡ **Performance-трекинг:** Специальные методы для красивой индикации быстрой или медленной работы функций.
* 🛡️ **Безопасность процессов:** Автоматический перехват критических ошибок `uncaughtException` и `unhandledRejection` с очисткой трейса от лишнего «мусора» Node.js.

---

## 📦 Установка

Вы можете установить модуль с помощью вашего любого пакетного менеджера:

```bash
npm install custom-color-logs
# или
yarn add custom-color-logs
```

---

## 🚨 Мажорные изменения (Миграция с v1.x на v2.x)

В версии **v2.0.0** были полностью вычищены исторические опечатки в динамических методах. Если вы использовали их, обновите названия в своём коде:

| Было в v1.x (С ошибками) | Стало в v2.x (Правильно) |
| :--- | :--- |
| `print.XFuctionPositivePerfomance` | `print.XFunctionPositivePerformance` |
| `print.XFunctionNegativePerfomance` | `print.XFunctionNegativePerformance` |
| `print.NodemailerFuctionPositiveSending` | `print.NodemailerFunctionPositiveSending` |

*(Где `X` — имя компонента: `Server`, `Socket`, `Database`, `Writter`, `Nodemailer`).*

---

## 💻 Пример использования и Тестирование

Просто подключите логгер в ваш проект. При первом запуске в корне вашего приложения автоматически сгенерируются все необходимые `.env` параметры:

```javascript
// Загрузка стилей из .env
require("dotenv").config();
// Загрузка модуля
const { print } = require("custom-color-logs");

// Использование:

// --- ИНФОРМАЦИЯ О СОСТОЯНИИ ---
// Информация
print.ServerInfo("Тестовое информационное сообщение сервера");
// Предупреждение
print.ServerWarn("Предупреждение: превышен лимит запросов");
// Ошибка
print.ServerError({ message: "Критический сбой базы данных" });

// --- ИНФОРМАЦИЯ ОТ ФУНКЦИЙ ---
// Информация от функции
print.DatabaseFunctionInfo("authCheck", "Проверка сессии пользователя");
// Статус выполнения функции
print.DatabaseFunctionStatus("authCheck", "Успешная авторизация (ID: 777)");
// Вывод функции
print.SocketFunctionPrint("emitEvent", "Отправка пакета всем активным клиентам");
// Положительное выполнение функции
print.ServerFunctionPositivePerformance("API_Request", "Время ответа в пределах нормы: 45ms");
// Отрицательное выполнение функции
print.ServerFunctionNegativePerformance("DB_Backup", "ВНИМАНИЕ! Резервное копирование заняло 12.4с");

// --- NODEMAILER ---
// Положительная отправка (письмо доставлено)
print.NodemailerFunctionPositiveSending("success-recipient@domain.com");
// Отрицательная отправка (письмо не отправлено)
print.NodemailerFunctionNegativeSending("failed-mailbox@domain.com");
```

---

## 🛠 Конфигурация в `.env`

После первого запуска в вашем `.env` появится следующий блок настроек. Вы можете менять префиксы статусов и любые цвета (логгер сам приведёт их к нужному регистру):

```ini
# ==============================================================================
# 🎨 CUSTOM-COLOR-LOGS CONFIGURATION (v2.0.0)
# ==============================================================================
CUSTOM_COLOR_LOGS_INITIALIZED                = true

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
TIME_COLOR                                   = "White"

# --- Функции и логика компонентов ---
NAME_FUNCTION_COLOR                          = "Lime"
CUSTOM_TEXT_TO_FUNCTION_COLOR                = "Gray"
POSITIVE_COLOR                               = "Green"
NEGATIVE_COLOR                               = "Orange"
```

> 💡 **Совет:** Если вы хотите вернуть настройки по умолчанию, просто удалите этот блок настроек из файла `.env` (при следующем запуске он сгенерируется заново).

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
npm install custom-color-logs
node test.js
```

## 📄 Лицензия (License)

[MIT](LICENSE) © RPM-programmer
* [На GitHub](https://github.com/RPM-programmer/custom-color-logs/blame/main/LICENSE)
* [На npm](https://www.npmjs.com/package/custom-color-logs/v/2.0.0-beta.3?activeTab=code)