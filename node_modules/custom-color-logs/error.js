const path = require("path");
const converter = require(path.join(__dirname, "converter.js"));
const errorsFile = path.join(__dirname, "logs", "errors.log");
const fs = require("fs");
const process = require("process");
require("dotenv").config();
const { safeChalk, formatAndCleanStack } = require(path.join(__dirname, "utils.js"));
const musicPlayer = require(path.join(__dirname, "music.js"));

function getSafeString(key, fallback = '') {
    return converter && converter[key] ? converter[key] : fallback; //
}

function saveErrorLogSync(errorTitle, errorMessage, details = '') {
    const now = new Date().toLocaleString('ru-RU'); //
    const logData = `\n------------------------------[ ${now} ]------------------------------\n` +
                    `TYPE: ${errorTitle}\nMESSAGE: ${errorMessage}\n${details}\n` +
                    `----------------------------------------------------------------------\n`; //
    try {
        const dir = path.dirname(errorsFile); //
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); //
        fs.appendFileSync(errorsFile, logData, "utf8"); //
    } catch (fsErr) {
        console.error('Критический сбой: невозможно записать лог-файл:', fsErr.message); //
    }
}

process.on("uncaughtException", (error) => {
    const cleanStack = formatAndCleanStack(error); //
    const customMessage = process.env.CUSTOM_ERROR_MESSAGE || "Uncaught Exception Detected"; //
    
    const server = getSafeString('SERVER', 'SERVER'); //
    const to = getSafeString('TO', '->'); //
    const and = getSafeString('AND', ' '); //
    const errorKey = getSafeString('ERROR', 'ERROR'); //

    console.error(`${server}${to}${and}${errorKey}${and}${safeChalk('CUSTOM_ERROR_MESSAGE_COLOR', customMessage)}\n${safeChalk('ERROR_COLOR', cleanStack)}`); //
    
    saveErrorLogSync("UNCAUGHT_EXCEPTION", error ? error.message : '', `STACK:\n${cleanStack}`); //
    musicPlayer.playErrorSound();
    setTimeout(() => {
        process.exit(1);
    }, 1000);

});

process.on('unhandledRejection', (reason, promise) => {
    const cleanStack = formatAndCleanStack(reason); //
    const customMessage = process.env.CUSTOM_ERROR_MESSAGE || "Unhandled Rejection Detected"; //
    const errorMessage = reason instanceof Error ? reason.message : String(reason); //
    
    const server = getSafeString('SERVER', 'SERVER'); //
    const to = getSafeString('TO', '->'); //
    const and = getSafeString('AND', ' '); //
    const errorKey = getSafeString('ERROR', 'ERROR'); //

    console.error(`${server}${to}${and}${errorKey}${and}${safeChalk('CUSTOM_ERROR_MESSAGE_COLOR', customMessage)}\n${safeChalk('COLOR', cleanStack)}`); //
    
    saveErrorLogSync("UNHANDLED_REJECTION", errorMessage, `STACK:\n${cleanStack}`); //
    musicPlayer.playErrorSound();
    setTimeout(() => {
        process.exit(1);
    }, 1000);
});
