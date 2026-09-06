# v1.5.5
## Версия 1.5.5
### Также модуль доступен на:
* ###  на npm 
* ### ссылка на скачивание [www.npmjs.com](https://www.npmjs.com/package/chalk-palette/v/1.5.5)
## В модуле появились дополнительные цвета и эффекты (+140 цветов и разные типы шрифта)
### Скачивание:
```java
npm i chalk-palette
```
### Использование:
#### CommonJS
```javascript
// Импортируем модуль через commonjs
const safeChalk = require("chalk-palette");
```
#### ES Modules
```javascript
// Импортируем модуль через ES Modules
import safeChalk from "chalk-palette";
```
### Выполнение
```javascript
// ОКРАШИВАНИЕ ТЕКСТА
// Синий текст
console.log(safeChalk.Blue("Blue"));
// Зелёный текст
console.log(safeChalk.Green("Green"));
// Красный текст
console.log(safeChalk.Red("Red"));

// ОКРАШИВАНИЕ ТЕКСТА И ФОНА
// Окрашивание фона в синий и текста в белый
console.log(safeChalk.bgBlue().White("Blue background and white text"));
// Окрашивание фона в зелёный и текста в серый
console.log(safeChalk.bgGreen().Black("Green background and black text"));
// Окрашивание фона в красный и текста в белый
console.log(safeChalk.bgRed().White("Red background and white text"));

// СПЕЦИАЛЬНЫЕ СТИЛИ
// Подчёркивание текста
console.log(safeChalk.underline("Underline"));
// Жирный текст
console.log(safeChalk.bold('Bold'));
// Блеклый текст
console.log(safeChalk.dim('Dim'));
// Курсив
console.log(safeChalk.italic('Italic'));
// Зачёркнутый текст
console.log(safeChalk.strikethrough('Strikethrough'));
// Инверсия цветов
console.log(safeChalk.inverse('Inverse'));

```

### Результат 

<img width="328" height="276" alt="Снимок экрана от 2026-09-04 17-37-45" src="https://github.com/user-attachments/assets/ef019be5-9e60-4b8d-b4b1-f4e6aaa2215b" />

### ramanapavel@gmail.com или p7841744@gmail.com

@RPM-programmer