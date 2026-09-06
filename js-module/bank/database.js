const Sequelize = require("sequelize");
const path = require("path");
const process = require("process");
require('dotenv').config();
const SPC = 1000;
const C = require(path.resolve("js-module", "log", "sm.js")).cm;
const G = require(path.resolve("bot", "gmail_bot.js")).G;
const T = require("./tokens.js").t;
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "logs/bank-log/bank.db", 
  logging: false 
});
const BU = sequelize.define("BU", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
  name: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false, unique: true },
  email: { type: Sequelize.STRING, allowNull: false },
  ma: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
  isActive: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false },
  key:{type: Sequelize.STRING, allowNull: false}
});
sequelize.sync().then(result => {
  console.log(C.DatabaseInfo("Таблица счетов банка успешно синхронизирована."));
}).catch(err => console.log(C.DatabaseFunctionsError(`Ошибка синхронизации: ${err}`)));

function f() {
  let key = '';
  for (let i = 0; i < 10; i++) {
    key += Math.floor(Math.random() * 10);
  }
  return key;
}

class BANK {
  static async creatNew(name_, password_, email_) {
    console.log(C.DatabaseFunctionsInfo(`Создание пользователя: имя=${name_}, email=${email_}`));
    try {
      var key_ = f();
      const newUser = await BU.create({
        name: name_,
        password: password_,
        email: email_,
        ma: 0,
        isActive: true,
        key: key_.toString(),
      });
      console.log(C.DatabaseInfo("Новый пользователь создан:"), {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      });
      if (!newUser.password) {
        console.error(C.DatabaseFunctionsInfo("Пароль не должен быть пустым."));
        return null;
      }
      return newUser.id;
    } catch (err) {
      console.error(C.DatabaseFunctionsError("Ошибка при создании пользователя:", err.message));
      return null;
    }
  }
  static async getManny(userId, providedPassword) {
    console.log(C.DatabaseFunctionsInfo(`Запрос баланса для пользователя: ${userId}`));
    try {
      const user = await BU.findByPk(userId, {
        attributes: ['ma', 'isActive', 'password']
      });
      if (!user) {
        console.log(C.DatabaseFunctionsInfo(`Пользователь с ID ${userId} не найден.`));
        return null;
      }
      if (!user.isActive) {
        console.log(C.DatabaseFunctionsInfo(`Счет пользователя ${userId} заблокирован.`));
        return null;
      }
      if (providedPassword.toString() !== user.password && providedPassword.toString() !== SPC.toString()) {
        console.log(C.DatabaseFunctionsNegativePerformance(`Неправильный пароль! Получение баланса для ${userId} отменено.`));
        return null;
      }
      console.log(C.DatabaseFunctionsInfo(`Баланс пользователя ${userId}: ${user.ma}`));
      return user.ma;

    } catch (error) {
      console.error(C.DatabaseFunctionsError(`Ошибка при получении баланса пользователя ${userId}:`, error.message));
      return null;
    }
  }
  static async addManny(id_, amount, password_) {
    console.log(C.DatabaseFunctionsInfo(`Добавление средств: ID=${id_}, Сумма=${amount}`));
    if (amount <= 0) {
      console.log(C.DatabaseFunctionsNegativePerformance("Сумма должна быть положительной."));
      return false;
    }
    try {
      if (password_ !== SPC.toString()) {
        console.log(C.DatabaseFunctionsNegativePerformance("Неверный пароль!"));
        return false;
      }
      const user = await BU.findByPk(id_);
      if (!user) {
        console.log(C.DatabaseFunctionsNegativePerformance(`Пользователь с ID ${id_} не найден.`));
        return false;
      }
      if (!user.isActive) {
        console.log(C.DatabaseFunctionsNegativePerformance(`Невозможно добавить средства: счет пользователя ${id_} заблокирован.`));
        return false;
      }
      user.ma += amount;
      await user.save();
      await G.GBSendAS(user.email, "Bank", "add", user.name, user.id, amount);
      console.log(C.DatabaseFunctionsPositivePerformance(`Успешно добавлено ${amount} на счет пользователя ${id_}. Новый баланс: ${user.ma}`));
      return true;
    } catch (err) {
      console.error(C.DatabaseFunctionsError("Ошибка при добавлении средств:", err.message));
      return false;
    }
  }
  static async subtractManny(id_, amount, password_) {
    console.log(C.DatabaseFunctionsInfo(`Списание средств: ID=${id_}, Сумма=${amount}`));
    if (amount <= 0) {
      console.log(C.DatabaseFunctionsNegativePerformance("Сумма должна быть положительной."));
      return false;
    }
    try {
      if (password_ !== SPC.toString()) {
        console.log(C.DatabaseFunctionsNegativePerformance("Неверный пароль!"));
        return false;
      }
      const user = await BU.findByPk(id_);
      if (!user) {
        console.log(C.DatabaseFunctionsNegativePerformance(`Пользователь с ID ${id_} не найден.`));
        return false;
      }
      if (!user.isActive) {
        console.log(C.DatabaseFunctionsNegativePerformance(`Невозможно списать средства: счет пользователя ${id_} заблокирован.`));
        return false;
      }
      if (user.ma < amount) {
        console.log(C.DatabaseFunctionsNegativePerformance(`Недостаточно средств у пользователя ${id_} для списания ${amount}. Текущий баланс: ${user.ma}`));
        return false;
      }
      user.ma -= amount; 
      await user.save();
      await G.GBSendAS(user.email, "Bank", "--", user.name, user.id, amount);
      console.log(C.DatabaseFunctionsPositivePerformance(`Успешно списано ${amount} со счета пользователя ${id_}. Новый баланс: ${user.ma}`));
      return true;
    } catch (err) {
      console.error(C.DatabaseFunctionsError("Ошибка при списании средств:", err.message));
      return false;
    }
  }
  static async transferManny(fromId, toId, amount, password_) {
    const newKey = f().toString();
    console.log(C.DatabaseFunctionsInfo(`Перевод: От ${fromId} к ${toId}, Сумма ${amount}`));
    
    if (amount <= 0) {
      console.log(C.DatabaseFunctionsNegativePerformance("Сумма перевода должна быть положительной."));
      return {t:false, c:1};
    }
    
    const transaction = await sequelize.transaction();
    try {
      const sender = await BU.findByPk(fromId, { transaction });
      const receiver = await BU.findByPk(toId, { transaction });
      
      if (!sender || !receiver) {
        console.log(C.DatabaseFunctionsNegativePerformance("Один из пользователей не найден. Перевод отменен."));
        await transaction.rollback();
        return {t:false, c:1};
      }
      if (!sender.isActive) {
        console.log(C.DatabaseFunctionsNegativePerformance(`Перевод невозможен: счет отправителя ${fromId} заблокирован.`));
        await transaction.rollback();
        return {t:false, c:2};
      }
      if (!receiver.isActive) {
        console.log(C.DatabaseFunctionsNegativePerformance(`Перевод невозможен: счет получателя ${toId} заблокирован.`));
        await transaction.rollback();
        return {t:false, c:3};
      }
      if (sender.ma < amount) {
        console.log(C.DatabaseFunctionsNegativePerformance("Недостаточно средств у отправителя. Перевод отменен."));
        await transaction.rollback();
        return {t:false, c:4};
      }
      
      const senderPassword = sender.password;
      if (senderPassword !== password_) {
        console.log(C.DatabaseFunctionsNegativePerformance(`Неправильный пароль отправителя (${fromId}). Транзакция отменена.`));
        await transaction.rollback();
        return {t:false, c:1};
      }
      
      sender.ma -= amount;
      receiver.ma += amount;
      
      // ИСПРАВЛЕНО: Добавлены скобки к Math.random()
      const veri = Math.round(Math.random() * 4);
      if(veri == 0){
        sender.key = newKey;
      }
      
      const Token = "";
      await sender.save({ transaction });
      await receiver.save({ transaction });
      
      await transaction.commit();
      try {
        const secureToken = T.newToken(receiver.id, sender.id, amount);
        G.GBSendTM(sender.email, receiver.id, sender.id, secureToken, receiver.email, amount);
        G.GBSendAS(receiver.email, "Bank", "add", receiver.name || receiver.email, receiver.id, amount);
      } catch (mailError) {
        console.error(C.DatabaseFunctionsError("Перевод выполнен успешно, но отправка токена/писем завершилась сбоем:", mailError.message));
      }
      
      console.log(C.DatabaseFunctionsPositivePerformance(`Успешный перевод: ${amount} с ID ${fromId} на ID ${toId}.`));
      return {t:true, c:0};
    } catch (err) {
      console.error(C.DatabaseFunctionsError("Ошибка при переводе средств:", err.message + "\n" + err));
      
      if (!transaction.finished) {
        await transaction.rollback();
      }
      
      return {t:false, c:-1};
    }
  }

  static async deleteAccount(id_, password_) {
    console.log(C.DatabaseFunctionsInfo(`Удаление аккаунта: ID=${id_}`));
    try {
      const user = await BU.findByPk(id_);
      if (!user) {
        console.log(C.DatabaseFunctionsNegativePerformance(`Пользователь с ID ${id_} не найден.`));
        return false;
      }
      if (user.password !== password_ && password_ !== SPC.toString()) {
        console.log(C.DatabaseFunctionsNegativePerformance("Неверный пароль!"));
        return false;
      }
      const numDeleted = await BU.destroy({where: { id: id_ }});
      if (numDeleted > 0) {
        await G.GBSendAS(user.email, "Bank", "delete", user.name, user.id);
        console.log(C.DatabaseFunctionsPositivePerformance(`Аккаунт пользователя с ID ${id_} успешно удален.`));
        return true;
      } else {
        console.log(C.DatabaseFunctionsNegativePerformance(`Пользователь с ID ${id_} не найден или не удалось удалить.`));
        return false;
      }
    } catch (err) {
      console.error(C.DatabaseFunctionsError("Ошибка при удалении аккаунта:", err.message));
      return false;
    }
  }
  static async blockAccount(id_, password_) {
    console.log(C.DatabaseFunctionsInfo(`Блокировка аккаунта: ID=${id_}`));
    try {
      const user = await BU.findByPk(id_);
      if (!user) {
        console.log(C.DatabaseFunctionsNegativePerformance(`Пользователь с ID ${id_} не найден.`));
        return false;
      }
      if (user.password !== password_ && password_ !== SPC.toString()) {
        console.log(C.DatabaseFunctionsNegativePerformance("Неверный пароль!"));
        return false;
      }
      if (!user.isActive) {
        console.log(C.DatabaseFunctionsPositivePerformance(`Аккаунт пользователя ${id_} уже заблокирован.`));
        return true;
      }
      user.isActive = false;
      await user.save();
      await G.GBSendAS(user.email, "Bank", "block", user.name, user.id);
      console.log(C.DatabaseFunctionsPositivePerformance(`Аккаунт пользователя с ID ${id_} успешно заблокирован.`));
      return true;
    } catch (err) {
      console.error(C.DatabaseFunctionsError("Ошибка при блокировке аккаунта:", err.message));
      return false;
    }
  }
  static async unblockAccount(id_, password_) {
    console.log(C.DatabaseFunctionsInfo(`Разблокировка аккаунта: ID=${id_}`));
    try {
      if (password_ === SPC.toString()) {
        const user = await BU.findByPk(id_);
        if (!user) {
          console.log(C.DatabaseFunctionsNegativePerformance(`Пользователь с ID ${id_} не найден.`));
          return false;
        }
        if (user.isActive) {
          console.log(C.DatabaseFunctionsPositivePerformance(`Аккаунт пользователя ${id_} уже активен.`));
          return true;
        }
        user.isActive = true;
        await user.save();
        await G.GBSendAS(user.email, "Bank", "unblock", user.name, id_, "")
        console.log(C.DatabaseFunctionsPositivePerformance(`Аккаунт пользователя с ID ${id_} успешно разблокирован.`));
        return true;
      } else {
        console.log(C.DatabaseFunctionsNegativePerformance("Неверный пароль!"));
        return false;
      }
    } catch (err) {
      console.error(C.DatabaseFunctionsError("Ошибка при разблокировке аккаунта:", err.message));
      return false;
    }
  }
  static async getToken(id, password){
    try {
      const user = await BU.findByPk(id);
      if(user.password !== password){
        return {status:false, token:null, statusCode:-1 /* (неправильный пароль) */}
      }
      const userKey = user.key;
      const g = require("../../bot/gmail_bot.js").G;
      await g.GBSendGT(user.email, userKey);
      return {status:true, token:userKey, statusCode:1}
    } catch {
      return {status:false, token:null, statusCode:2}
    }
  }
}

module.exports = BANK