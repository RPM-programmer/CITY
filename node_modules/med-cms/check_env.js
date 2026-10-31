const print = require("custom-color-logs").print;

(function enforceEnvSecurity() {
  const isDefaultJWT = process.env.JWT_SECRET === "0000";
  const isDefaultPass = process.env.ADMIN_PASSWORD === "1234";

  if (isDefaultJWT || isDefaultPass) {
    // Красивое стартовое предупреждение
    console.log(
      print.ServerMedSeqError(
        "======================================================",
      ),
    );
    console.log(print.ServerMedSeqWarn("ОБНАРУЖЕНЫ НАСТРОЙКИ ПО УМОЛЧАНИЮ!"));
    console.log(
      print.ServerMedSeqWarn(
        "Безопасность системы под угрозой. Данные пациентов уязвимы.",
      ),
    );
    console.log(
      print.ServerMedSeqInfo(
        "Пожалуйста, измените значения JWT_SECRET и ADMIN_PASSWORD в .env",
      ),
    );
    console.log(
      print.ServerMedSeqError(
        "======================================================",
      ),
    );
    const alertInterval = setInterval(() => {
      console.log(
        print.ServerMedSeqError(
          "СРОЧНО СМЕНИТЕ ДЕФОЛТНЫЕ ДАННЫЕ В .env ДЛЯ БЕЗОПАСНОСТИ!",
        ),
      );
    }, 4000);
    alertInterval.unref();
  }
})();
