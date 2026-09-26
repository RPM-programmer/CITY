require("dotenv").config();
const process = require("process");
const chalk = require("./chalk-palette.js");

if (process.env.SHOW_TIME_AT_LOG === "true") {
    const originalLog = console.log;
    console.log = function (...args) {
        const time = new Date().toLocaleTimeString();
        
        const rawColor = process.env.TIME_COLOR || 'White';
        const cleanColor = rawColor.replace(/;/g, '').trim().toLowerCase();
        const formattedColor = cleanColor.charAt(0).toUpperCase() + cleanColor.slice(1);
        
        const paintTime = (typeof chalk[formattedColor] === 'function') 
            ? chalk[formattedColor](`[${time}]`) 
            : `[${time}]`;

        originalLog.apply(console, [paintTime, ...args]);
    };
}
