require("dotenv").config();
const process = require("process");
const chalk = require("chalk-palette");

if (process.env.SHOW_TIME_AT_LOG == "true") {
const originalLog = console.log;
console.log = function (...args) {
  const time = new Date().toLocaleTimeString();
  originalLog.apply(console, [chalk[process.env.TIME_COLOR](`[${time}]`), ...args]);
};
}