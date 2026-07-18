# CITY

_ru_

## Этот репозиторий для создания сайта для игры (по типу реальной жизни) на языке Javascript

![Node.js - image](https://cdn-icons-png.flaticon.com/512/919/919825.png)

### Этот прект использует язык программирования JavaScript.
### Для создания сервера используется node.js.
### Сервер работает на http порту, но при необходимости можно изменить на https   
### Перед запуском требуется установить через npm (Node Package Menedger) следущие модули:

- #### chalk (npm install --save chalk) (Если у вас Linux ubuntu до 25.10 chalk работать не будет).
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

### Внимание! Перед запуском на https сервера создайте самоподписанный сертификат! Вот команда (linux ubuntu)(Ввести в CITY):

- #### ***openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout key.pem -out cert.pem -subj "/CN={порт сервера}"***

###### Р.П.М

_en_

## This repository is for creating a website for a game (like real life) using JavaScript.

![Node.js - image](https://cdn-icons-png.flaticon.com/512/919/919825.png)

### This project uses JavaScript.
### Node.js is used to create the server.
### The server runs on the http port, but can be changed to https if needed.
### Before running, you need to install the following modules via npm (Node Package Manager):

- #### chalk (npm install --save chalk) (If you are running Linux Ubuntu prior to 25.10, chalk will not work).
- #### cors (npm install --save cors).
- #### express (npm install --save express).
- #### express-rate-limit (npm install --save express-rate-limit).
- #### helmet (npm install --save helmet).
- #### progress (npm install --save progress).
- #### sequelize (npm install --save sequelize).
- #### sqlite3 (npm install --save sqlite3).

### Launching differs depending on http or https (to launch, go to the CITY folder (cd CITY) and enter the command):
- #### http - ***node http.js***
- #### https - ***node https.js***

### Warning! Before launching on an https server, create a self-signed certificate! Here's the command (Linux Ubuntu) (Enter in CITY):

- #### ***openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout key.pem -out cert.pem -subj "/CN={server port}"***

###### R.P.M