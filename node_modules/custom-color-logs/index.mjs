import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const path = require("path");
// Импортируем наше CommonJS-ядро
const cjsModule = require(path.join(__dirname, 'index.js'));

// Экспортируем именованную переменную print для синтаксиса `import { print } from ...`
export const print = cjsModule.print;

// Экспортируем по дефолту для синтаксиса `import print from ...`
export default cjsModule.print;
