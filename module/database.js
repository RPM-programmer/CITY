const Sequelize = require("sequelize");
const SPC = 1310;
const C = require("./sm").cm;
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "bank.db", 
  logging: false 
});
const BU = sequelize.define("BU", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
  name: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false, unique: true },
  email: { type: Sequelize.STRING, allowNull: false },
  ma: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
  isActive: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false }
});
sequelize.sync().then(result => {
  console.log(C.DatabaseInfo("Таблица счетов банка успешно синхронизирована."));
}).catch(err => console.log(C.DatabaseFunctionsError(`Ошибка синхронизации: ${err}`)));


class BC {
  static async creatNew(name_, password_, email_) {
    console.log(C.DatabaseFunctionsInfo(`Создание пользователя: имя=${name_}, email=${email_}`));
    try {
      const newUser = await BU.create({
        name: name_,
        password: password_,
        email: email_,
        ma: 0,
        isActive: true 
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
      console.log(C.DatabaseFunctionsPositivePerformance(`Успешно списано ${amount} со счета пользователя ${id_}. Новый баланс: ${user.ma}`));
      return true;
    } catch (err) {
      console.error(C.DatabaseFunctionsError("Ошибка при списании средств:", err.message));
      return false;
    }
  }
  static async transferManny(fromId, toId, amount, password_) {
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
      await sender.save({ transaction });
      await receiver.save({ transaction });
      await transaction.commit();
      console.log(C.DatabaseFunctionsPositivePerformance(`Успешный перевод: ${amount} с ID ${fromId} на ID ${toId}.`));
      return {t:true, c:0};
    } catch (err) {
      console.error(C.DatabaseFunctionsError("Ошибка при переводе средств:", err.message));
      await transaction.rollback();
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
}

module.exports.b = BC;