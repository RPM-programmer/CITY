const nodemailer = require('nodemailer');
const path = require("path");
require("dotenv").config();
const L = require(path.resolve("js-module", "log", "sm.js")).cm;
const l = require("./../js-module/log/sm.js").cm;
// Настройка транспортера (рекомендуется вынести пароль в .env)


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
console.log(L.GBotInfo("Gmail транспортер успешно настроен!"));

function gtx(company_name, verification_link, text, status, user_name, id) {
  console.log(L.GBotFunctionsPositivePerformance("HTML код письма успешно сгенерирован!"));
  
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Подтверждение аккаунта</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f5f7f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f7f6; padding: 20px 0;">
      <tr>
        <td align="center">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(16, 42, 28, 0.04);">
            <tr>
              <td style="background-color: #0F5132; padding: 35px 30px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; font-family: 'Georgia', serif;">
                  ${company_name}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px; color: #2D3748; font-size: 16px; line-height: 1.65;">
                <h2 style="margin-top: 0; margin-bottom: 18px; color: #1A202C; font-size: 20px; font-weight: 600;">
                  Здравствуйте, ${user_name}!
                </h2>
                <p style="margin-top: 0; margin-bottom: 25px; color: #4A5568;">
                  ${text}
                </p>
                <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                  <tr>
                    <td align="center" style="border-radius: 6px;" bgcolor="#198754">
                      <a href="https://192.168.0.107:3000/bank/login/${id}/${verification_link}" target="_blank" rel="noopener" style="font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 14px 32px; display: inline-block; border-radius: 6px; background-color: #198754;">
                        Подтвердить аккаунт
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin-bottom: 0; color: #4A5568;">
                  С уважением,<br>Команда поддержки Банка
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f9fbf9; padding: 25px 30px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 8px 0; line-height: 1.5;">Вы получили это письмо, потому что ${status}.</p>
                <p style="margin: 0;">&copy; 2026 ${company_name}. Все права защищены.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function gth(company_name, text, status, user_name, s_s) {
  console.log(L.GBotFunctionsPositivePerformance("HTML код письма успешно сгенерирован!"));
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Уведомление о счёте</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f5f7f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f7f6; padding: 20px 0;">
      <tr>
        <td align="center">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(16, 42, 28, 0.04);">
            <tr>
              <td style="background-color: #0F5132; padding: 35px 30px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; font-family: 'Georgia', serif;">
                  ${company_name}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px; color: #2D3748; font-size: 16px; line-height: 1.65;">
                <h2 style="margin-top: 0; margin-bottom: 18px; color: #1A202C; font-size: 20px; font-weight: 600;">
                  Здравствуйте, ${user_name}! Уведомляем вас о том, что ваш счёт ${s_s}!
                </h2>
                <p style="margin-top: 0; margin-bottom: 25px; color: #4A5568;">
                  ${text}
                </p>
                <p style="margin-bottom: 0; color: #4A5568;">
                  С уважением,<br>Команда поддержки Банка
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f9fbf9; padding: 25px 30px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 8px 0; line-height: 1.5;">Вы получили это письмо, потому что ${status}.</p>
                <p style="margin: 0;">&copy; 2026 ${company_name}. Все права защищены.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function gthtm(company_name, user_name, from, to, from_, to_, token, manny) {
  console.log(L.GBotFunctionsPositivePerformance("HTML код письма успешно сгенерирован!"));
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Уведомление о переводе</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f5f7f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f7f6; padding: 20px 0;">
      <tr>
        <td align="center">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(16, 42, 28, 0.04);">
            <tr>
              <td style="background-color: #0F5132; padding: 35px 30px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; font-family: 'Georgia', serif;">
                  ${company_name}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px; color: #2D3748; font-size: 16px; line-height: 1.65;">
                <h2 style="margin-top: 0; margin-bottom: 18px; color: #1A202C; font-size: 20px; font-weight: 600;">
                  Здравствуйте, ${user_name}! Уведомляем вас о том, что с вашего счёта были списаны ${manny} рублей  (счёт — ${from_}).
                </h2>
                <p style="margin-top: 0; margin-bottom: 25px; color: #4A5568;">
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                    <tbody>
                      <tr>
                        <td style="background-color: #00b35f; border: 1px solid #00b35f; border-radius: 10px; padding: 5px 20px; width: 30%;">Отправитель</td>
                        <td style="background-color: #00b35f; border: 1px solid #00b35f; border-radius: 10px; padding: 5px 20px; width: 70%;">${from_} (${from})</td>

                      </tr>
                      <tr>
                        <td style="background-color: #00b35f; border: 1px solid #00b35f; border-radius: 10px; padding: 5px 20px; width: 30%;">Получатель</td>
                        <td style="background-color: #00b35f; border: 1px solid #00b35f; border-radius: 10px; padding: 5px 20px; width: 70%;">${to_} (${to})</td>
                      </tr>
                    </tbody>
                  </table>
                  Если это не вы — не подтверждайте аккаунт. (через 2 минуты деньги вернуться)
                </p>
                <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                  <tr>
                    <td align="center" style="border-radius: 6px;" bgcolor="#198754">
                      <a href="https://192.168.0.107:3000/bank/help/${token}" target="_blank" rel="noopener" style="font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 14px 32px; display: inline-block; border-radius: 6px; background-color: #198754;">
                        Подтвертдить аккаунт
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin-bottom: 0; color: #4A5568;">
                  С уважением,<br>Команда поддержки Банка
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f9fbf9; padding: 25px 30px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 8px 0; line-height: 1.5;">Вы получили это письмо, потому что был перевод с вашего щёта.</p>
                <p style="margin: 0;">&copy; 2026 ${company_name}. Все права защищены.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
function gth2(company_name, newToken, name) {
  console.log(L.GBotFunctionsPositivePerformance("HTML код письма успешно сгенерирован!"));
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Уведомление о счёте</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f5f7f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f7f6; padding: 20px 0;">
      <tr>
        <td align="center">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(16, 42, 28, 0.04);">
            <tr>
              <td style="background-color: #0F5132; padding: 35px 30px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; font-family: 'Georgia', serif;">
                  ${company_name}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px; color: #2D3748; font-size: 16px; line-height: 1.65;">
                <h2 style="margin-top: 0; margin-bottom: 18px; color: #1A202C; font-size: 20px; font-weight: 600;">
                  Здравствуйте, ${name}! Уведомляем вас о том, ваш токен ...!
                </h2>
                <p style="margin-top: 0; margin-bottom: 25px; color: #4A5568;">
                  Токен - ${newToken}
                </p>
                <p style="margin-bottom: 0; color: #4A5568;">
                  С уважением,<br>Команда поддержки Банка
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f9fbf9; padding: 25px 30px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 8px 0; line-height: 1.5;">Вы получили это письмо, потому что вы запросили новый токен.</p>
                <p style="margin: 0;">&copy; 2026 ${company_name}. Все права защищены.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

class gmailSend {
  static GBSendCBA(TO, SUBJECT, TEXT, FL, STATUS, NAME, ID) {
    if (!SUBJECT) SUBJECT = 'Bank';

    const mailOptions = {
      from: '"Bank" <p7841744@gmail.com>',
      to: TO.toString().toLowerCase(),
      subject: SUBJECT,
      html: gtx('Bank', FL, TEXT, STATUS, NAME, ID)
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(L.GBotFunctionsNegativePerformance("Письмо не отправлено!"));
          console.log(L.GBotFunctionsError("Ошибка отправки письма!", error))
          return;
        }
        console.log(L.GBotFunctionsPositivePerformance(`Письмо отправлено! Получатель - ${TO}, Информация - ${info.response}`));
      }
    )
  }

  static GBSendAS(TO, subject_, STATUS, NAME, ID, Manny) {
    let stat;
    let text;
    let s_S;

    switch (STATUS) {
      case 'block':
        stat = 'ваш счёт заблокирован';
        text = `Здравствуйте, ${NAME || TO}. Номер счёта — ${ID}.`;
        s_S = 'заблокирован';
        break;
      case 'unblock':
        stat = 'ваш счёт разблокирован';
        text = `Здравствуйте, ${NAME || TO}. Номер счёта — ${ID}.`;
        s_S = 'разблокирован';
        break;
      case 'delete':
        stat = 'ваш счёт удалён';
        text = `Здравствуйте, ${NAME || TO}. Номер счёта — ${ID}.`;
        s_S = 'удалён';
        break;
      case 'add':
        stat = 'на ваш счёт добавили деньги';
        text = `Здравствуйте, ${NAME || TO}. Номер счёта — ${ID}. Сумма: ${Manny || ''}.`;
        s_S = 'увеличен (баланс)';
        break;
      case '--':
        stat = 'с вашего счёта списали деньги';
        text = `Здравствуйте, ${NAME || TO}. Номер счёта — ${ID}. Сумма: ${Manny || ''}.`;
        s_S = 'уменьшен (баланс)';
        break;
      default:
        stat = 'произошло изменение по вашему счёту';
        text = `Здравствуйте, ${NAME || TO}. Номер счёта — ${ID}.`;
        s_S = 'изменён';
    }

    if (!subject_) subject_ = 'Bank';

    const mailOptions = {
      from: '"Bank" <p7841744@gmail.com>',
      to: TO.toString().toLowerCase(),
      subject: subject_,
      html: gth('Bank', text, stat, NAME || TO, s_S)
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(L.GBotFunctionsNegativePerformance("Письмо не отправлено!"));
          console.log(L.GBotFunctionsError("Ошибка отправки письма!", error))
          return;
        }
        console.log(L.GBotFunctionsPositivePerformance(`Письмо отправлено! Получатель - ${TO}, Информация - ${info.response}`));
      }
    )
  }

  static GBSendTM(toGmail, toID, fromID, Token, toG, Manny) {
    const SUBJECT = 'Bank';

    const mailOptions = {
      from: '"Bank" <p7841744@gmail.com>',
      to: toGmail.toString().toLowerCase(),
      subject: SUBJECT,
      html: gthtm('Bank', toGmail, toGmail, toG, fromID, toID, Token, Manny)
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(L.GBotFunctionsNegativePerformance("Письмо не отправлено!"));
          console.log(L.GBotFunctionsError("Ошибка отправки письма!", error))
          return;
        }
        console.log(L.GBotFunctionsPositivePerformance(`Письмо отправлено! Получатель - ${toGmail}, Информация - ${info.response}`));
      }
    )
  }
  static GBSendGT(TO, NewCode){
    const mailOptions = {
      from: '"Bank" <p7841744@gmail.com>',
      to: TO.toString().toLowerCase(),
      subject: "Bank",
      html: gth2("Bank", NewCode, TO)
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(L.GBotFunctionsNegativePerformance("Письмо не отправлено!"));
          console.log(L.GBotFunctionsError("Ошибка отправки письма!", error))
          return;
        }
        console.log(L.GBotFunctionsPositivePerformance(`Письмо отправлено! Получатель - ${TO}, Информация - ${info.response}`));
      }
    )
  }
}

module.exports.G = gmailSend;
