require("./patch.js"); 

const process = require("process"); 
const chalk = require("./chalk-palette.js"); 
const converter = require("./converter.js"); 
const fs = require('fs'); 
const path = require('path'); 
require("dotenv").config(); 

const errorsFile = "./logs/errors.log"; 
const shouldLog = (process.env.SHOW_MODULE_LOGS === 'true' || process.env.SHOW_START_LOG === 'true'); 

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

function safeChalk(colorKey, text) {
    if (!text) return '';
    const colorName = process.env[colorKey] || colorKey;
    if (!colorName) return text;

    const cleanColor = colorName.replace(/;/g, '').trim().toLowerCase();
    const formattedColor = cleanColor.charAt(0).toUpperCase() + cleanColor.slice(1);

    if (typeof chalk[formattedColor] === 'function') {
        return chalk[formattedColor](text);
    }
    return text;
}

function formatAndCleanStack(error) {
    if (!error || !error.stack) return String(error); 
    return error.stack
        .split('\n')
        .filter(line => !line.includes('node:internal') && !line.includes('(internal/') && !line.includes('node_modules')) 
        .join('\n'); 
}

function saveErrorLogSync(errorTitle, errorMessage, details = '') {
    const now = new Date().toLocaleString('ru-RU'); 
    const logData = `\n------------------------------[ ${now} ]------------------------------\n` +
                    `TYPE: ${errorTitle}\nMESSAGE: ${errorMessage}\n${details}\n` +
                    `----------------------------------------------------------------------\n`; 
    try {
        const dir = path.dirname(errorsFile); 
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); 
        fs.appendFileSync(errorsFile, logData, "utf8"); 
    } catch (fsErr) {
        console.error('Не удалось записать лог-файл:', fsErr.message); 
    }
}

// --- ДИНАМИЧЕСКИЙ КЛАСС ЛОГЕРА ---

class BaseLogger {
    constructor(componentKey) {
        this.component = converter[componentKey] || componentKey;
    }

    _prefix() {
        return `${converter.SERVER}${converter.TO}${this.component}${converter.TO}${converter.AND}`;
    }

    Info(info) {
        return `${this._prefix()}${converter.INFO}${converter.AND}${info}`;
    }

    Error(error) {
        const errMsg = error && error.message ? error.message : String(error);
        return `${this._prefix()}${converter.ERROR}${converter.AND}${errMsg} \n ${safeChalk('ERROR_COLOR', errMsg)}`;
    }

    Warn(warn) {
        return `${this._prefix()}${converter.WARN}${converter.AND}${warn}`;
    }

    FunctionInfo(funName, info) {
        return `${this._prefix()}${converter.FUNCTION_INFO}${converter.AND}${safeChalk('NAME_FUNCTION_COLOR', `[-${funName}-]`)}${converter.AND}${safeChalk('CUSTOM_TEXT_TO_FUNCTION_COLOR', info)}`;
    }

    FunctionStatus(function_name, return_info) {
        return `${this._prefix()}${converter.FUNCTION_STATUS}${converter.AND}${safeChalk('NAME_FUNCTION_COLOR', `[-${function_name}-]`)}${converter.AND}${"status"}${converter.AND}${safeChalk('CUSTOM_TEXT_TO_FUNCTION_COLOR', return_info)}`;
    }

    FunctionPrint(funName, text) {
        return `${this._prefix()}${converter.LOG}${converter.AND}${safeChalk('NAME_FUNCTION_COLOR', `[-${funName}-]`)}${converter.AND}${safeChalk('CUSTOM_TEXT_TO_FUNCTION_COLOR', text)}`;
    }

    FunctionPositivePerformance(funName, text) { 
        return `${this._prefix()}${converter.POSITIVE}${converter.AND}${safeChalk('PNAME_COLOR', funName)}${converter.AND}${safeChalk('COLOR', text)}`;
    }

    FunctionNegativePerformance(funName, text) {
        return `${this._prefix()}${converter.NEGATIVE}${converter.AND}${safeChalk('NNAME_COLOR', funName)}${converter.AND}${safeChalk('COLOR', text)}`;
    }
}

// --- АВТОМАТИЧЕСКАЯ СБОРКА ИНТЕРФЕЙСА ---

const components = {
    Server: 'SERVER', 
    Socket: 'SOCKET',
    Writter: 'WRITTER',
    Database: 'DATABASE',
    Nodemailer: 'NODEMAILER'
};

class print {}

Object.entries(components).forEach(([className, targetKey]) => {
    const logger = new BaseLogger(targetKey);
    
    const methods = [
        'Info', 'Error', 'Warn', 'FunctionInfo', 'FunctionStatus', 'FunctionPrint', 
        'FunctionPositivePerformance', 'FunctionNegativePerformance'
    ];
    
    methods.forEach(method => {
        const finalMethodName = `${className}${method}`;
        print[finalMethodName] = (...args) => logger[method](...args);
    });
});

// Специфичные методы для Nodemailer (теперь без опечаток)
print.NodemailerFunctionPositiveSending = function(gmail) {
    return `${converter.SERVER}${converter.TO}${converter.NODEMAILER}${converter.TO}${converter.AND}${converter.POSITIVE_SEND}${converter.AND} Gmail - ${safeChalk('GMAIL_COLOR', gmail)}`;
};

print.NodemailerFunctionNegativeSending = function(gmail) {
    return `${converter.SERVER}${converter.TO}${converter.NODEMAILER}${converter.TO}${converter.AND}${converter.NEGATIVE_SEND}${converter.AND} Gmail - ${safeChalk('GMAIL_COLOR', gmail)}`;
};

// --- СИСТЕМНЫЕ ИНИЦИАЛИЗАЦИИ ---

function getModuleNameFromFile(filePath) {
    let currentDir = path.dirname(filePath);
    while (currentDir !== path.parse(currentDir).root) {
        const pkgPath = path.join(currentDir, 'package.json');
        if (fs.existsSync(pkgPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
                return pkg.name || path.basename(currentDir); 
            } catch { return path.basename(currentDir); }
        }
        currentDir = path.dirname(currentDir);
    }
    return null;
}

const activeModules = Object.keys(require.cache).filter(filePath => filePath !== __filename).map(filePath => getModuleNameFromFile(filePath)).filter(name => name !== null);
const uniqueModules = [...new Set(activeModules)];

function logModulesState(rawColor, activeMsg, emptyMsg) {
    if (uniqueModules.length === 0) {
        console.log(`${converter.SERVER}${converter.TO}${converter.MODULES} ${converter.INFO} ${converter.safeColor(rawColor, emptyMsg)}`);
    } else {
        uniqueModules.forEach((mod) => {
            const formattedMod = typeof chalk.Cyan === 'function' ? `${chalk.Cyan('[')} ${chalk.Cyan(mod.toUpperCase())} ${chalk.Cyan(']')}` : `[ ${mod.toUpperCase()} ]`;
            console.log(`${converter.SERVER}${converter.TO}${converter.MODULES}${converter.TO}${formattedMod} ${converter.INFO} ${converter.safeColor(rawColor, activeMsg)}`);
        });
    }
}

if (shouldLog) {
    console.log(`${converter.SERVER}${converter.TO}${converter.MODULES}${converter.TO}${converter.MODULE_NAME} ${converter.INFO} ${converter.CUSTOM_START_MESSAGE}`);
    logModulesState(process.env.CUSTOM_MODULES_START_MESSAGE_COLOR, process.env.CUSTOM_MODULES_START_MESSAGE, process.env.CUSTOM_MODULES_START_MESSAGE_IF_ISNT_MODULES);
}

process.on("beforeExit", () => {
    if (process.env.SHOW_END_LOG === "true") {
        logModulesState(process.env.CUSTOM_MODULES_STOP_MESSAGE_COLOR, process.env.CUSTOM_MODULES_STOP_MESSAGE, process.env.CUSTOM_MODULES_STOP_MESSAGE_IF_ISNT_MODULES);
        const finalMessage = process.env.CUSTOM_MODULE_STOP_MESSAGE || "Code is stop!";
        console.log(`${converter.SERVER}${converter.TO}${converter.MODULES}${converter.TO}${converter.MODULE_NAME} ${converter.INFO} ${converter.safeColor(process.env.COLOR, finalMessage)}`);
    }
});

process.on("uncaughtException", (error) => {
    const cleanStack = formatAndCleanStack(error);
    const customMessage = process.env.CUSTOM_ERROR_MESSAGE || "Uncaught Exception Detected";
    console.log(converter.SERVER + converter.TO + converter.AND + converter.ERROR + converter.AND + safeChalk('CUSTOM_ERROR_MESSAGE_COLOR', customMessage) + "\n" + safeChalk('ERROR_COLOR', cleanStack));
    saveErrorLogSync("UNCAUGHT_EXCEPTION", error ? error.message : '', `STACK:\n${cleanStack}`);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    const cleanStack = formatAndCleanStack(reason);
    const customMessage = process.env.CUSTOM_ERROR_MESSAGE || "Unhandled Rejection Detected";
    const errorMessage = reason instanceof Error ? reason.message : String(reason);
    console.log(converter.SERVER + converter.TO + converter.AND + converter.ERROR + converter.AND + safeChalk('CUSTOM_ERROR_MESSAGE_COLOR', customMessage) + "\n" + safeChalk('COLOR', cleanStack));
    saveErrorLogSync("UNHANDLED_REJECTION", errorMessage, `STACK:\n${cleanStack}`);
    process.exit(1);
});

module.exports = { print };
