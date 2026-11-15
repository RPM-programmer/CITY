require("dotenv").config();
const chalk = require("chalk-palette");

function getSafeColorMethod(envValue, defaultColor) {
  if (!envValue) return defaultColor;
  const clean = envValue.replace(/;/g, "").trim().toLowerCase();
  if (!clean) return defaultColor;
  const formattedColor = clean.charAt(0).toUpperCase() + clean.slice(1);
  return typeof chalk[formattedColor] === "function"
    ? formattedColor
    : defaultColor;
}

if (process.env.SHOW_TIME_AT_LOG === "true") {
  const originalLog = console.log;

  console.log = function (...args) {
    const time = new Date().toLocaleTimeString();
    const timeColor = getSafeColorMethod(process.env.TIME_COLOR, "White");
    const textColor = getSafeColorMethod(process.env.COLOR, "Gray");

    const paintTime =
      typeof chalk[timeColor] === "function"
        ? chalk[timeColor](`[${time}]`)
        : `[${time}]`;

    const formattedArgs = args.map((arg) => {
      if (typeof arg === "string") {
        const cleanStr = arg.replace(/[\u001b\x1b]\[[0-9;]*m/g, "");
        if (cleanStr.startsWith("SYSTEM:") || cleanStr.startsWith("NODE:")) {
          return arg;
        }
        return typeof chalk[textColor] === "function"
          ? chalk[textColor](arg)
          : arg;
      }
      // Объекты, ошибки и массивы отдаем нативному console.log без ручного разбора
      return arg;
    });

    originalLog.call(console, paintTime, ...formattedArgs);
  };
}
