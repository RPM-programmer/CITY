# CITY

## Этот репозиторий для создания сайта для игры (по типу реальной жизни) на языке Javascript

![Node.js - image](https://cdn-icons-png.flaticon.com/512/919/919825.png)

### Этот прект использует язык программирования JavaScript.
### Для создания сервера используется node.js.
### Сервер работает на http порту, но при необходимости можно изменить на https   
### Перед запуском требуется установить через npm (Node Package Menedger) следущие модули:

- #### chalk (npm install --save chalk) (Если у вас Linux ubuntu до 25.10 chalk раюотать не будет).
- #### cors (npm install --save cors).
- #### express (npm install --save express).
- #### express-rate-limit (npm install --save express-rate-limit).
- #### helmet (npm install --save helmet).
- #### progress (npm install --save progress).
- #### sequelize (npm install --save sequelize).
- #### sqlite3 (npm install --save sqlite3).

### Запуск отличается в зависимости http или https (для запуска перейдите в папку CITY (cd CITY) и введите команду):
- #### http - ***node http.js***
- #### https - ***node https.js***

### Внимание! Перед запуском на https сервера создайте самоподписанный сертификат! Вот команда (linux ubuntu)(Ввести в /CITY):

- #### ***openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout key.pem -out cert.pem -subj "/CN={порт сервера}"***

###### Р.П.М