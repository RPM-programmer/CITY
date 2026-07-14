const {default : chalk} = require("chalk");

class Logger {
  static ServerInfo(text) {
    return `${chalk.blue('SERVER:')} ${chalk.blue('@info:~')} ${chalk.grey(text)}`;
  }
  static ServerWarning(text) {
    return `${chalk.blue('SERVER:')} ${chalk.yellow('@warning:~')} ${chalk.grey(text)}`;
  }
  static ServerFunctionsInfo(text) {
    return `${chalk.blue('SERVER:')} ${chalk.blue(`@info > ${chalk.grey('#fun-info')}`)} ${chalk.grey(text)}`;
  }
  static ServerFunctionsNegativePerformance(text) {
    return `${chalk.blue('SERVER:')} ${chalk.blue(`@log > ${chalk.underline.grey("fun-log:")}`)} ${chalk.underline.rgb(255, 165, 0)("negative_perfomance")} ${chalk.grey(text)}`;
  }
  static ServerFunctionsPositivePerformance(text) {
    return `${chalk.blue('SERVER:')} ${chalk.blue(`@log > ${chalk.underline.grey("fun-log:")}`)} ${chalk.underline.green("positive_perfomance")} ${chalk.grey(text)}`;
  }
  static ServerFunctionsError(text, error) {
    return `\n ${chalk.blue('SERVER:')} ${chalk.red('@ERROR:')} ${chalk.rgb(255, 165, 0)(text + ' ^error:')} \n ${chalk.red(error)} \n`;
  }

  // --- DATABASE LOGS ---

  static DatabaseInfo(text) {
    return `${chalk.blue('SERVER > DATABASE:')} ${chalk.blue('@info:~')} ${chalk.grey(text)}`;
  }
  static DatabaseWarning(text) {
    return `${chalk.blue('SERVER > DATABASE:')} ${chalk.yellow('@warning:~')} ${chalk.grey(text)}`;
  }
  static DatabaseFunctionsInfo(text) {
    return `${chalk.blue('SERVER > DATABASE:')} ${chalk.blue(`@info > ${chalk.grey('#fun-info')}`)} ${chalk.grey(text)}`;
  }
  static DatabaseFunctionsNegativePerformance(text) {
    return `${chalk.blue('SERVER > DATABASE:')} ${chalk.blue(`@log > ${chalk.underline.grey("fun-log:")}`)} ${chalk.underline.rgb(255, 165, 0)("negative_perfomance")} ${chalk.grey(text)}`;
  }
  static DatabaseFunctionsPositivePerformance(text) {
    return `${chalk.blue('SERVER > DATABASE:')} ${chalk.blue(`@log > ${chalk.underline.grey("fun-log:")}`)} ${chalk.underline.green("positive_perfomance")} ${chalk.grey(text)}`;
  }
  static DatabaseFunctionsError(text, error) {
    return `\n ${chalk.blue('SERVER > DATABASE:')} ${chalk.red('@ERROR:')} ${chalk.rgb(255, 165, 0)(text + ' ^error:')} \n ${chalk.red(error)} \n`;
  }
}

module.exports.cm = Logger;
