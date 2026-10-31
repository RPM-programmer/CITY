const jwt = require("jsonwebtoken");
const { SPECIALTY_PERMISSIONS } = require("./permissions");

module.exports = function (jwtSecret) {
  return {
    /**
     * Основная проверка авторизации по HttpOnly куке
     */
    verifyCookie: (req, res, next) => {
      const token = req.cookies.med_auth_token;

      if (!token) {
        return res
          .status(401)
          .json({
            success: false,
            message: "Доступ запрещен. Пожалуйста, войдите в систему.",
          });
      }

      try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded; // Добавляем в req: id, role, specialty
        next();
      } catch (err) {
        return res
          .status(401)
          .json({
            success: false,
            message: "Ваша сессия устарела. Войдите заново.",
          });
      }
    },

    /**
     * Проверка глобальной роли (admin, doctor, patient)
     */
    requireRole: (allowedRoles) => {
      return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
          return res
            .status(403)
            .json({
              success: false,
              message: "Недостаточно прав для выполнения этого действия.",
            });
        }
        next();
      };
    },

    /**
     * Проверка специфического медицинского действия на основе специальности врача
     */
    checkPermission: (requiredPermission) => {
      return (req, res, next) => {
        // Администраторам разрешаем любые медицинские эндпоинты по дефолту
        if (req.user && req.user.role === "admin") {
          return next();
        }

        const doctorSpecialty = req.user?.specialty;
        if (!doctorSpecialty) {
          return res
            .status(403)
            .json({
              success: false,
              message: "Действие доступно только медицинскому персоналу.",
            });
        }

        const allowedPermissions = SPECIALTY_PERMISSIONS[doctorSpecialty] || [];

        if (!allowedPermissions.includes(requiredPermission)) {
          return res.status(403).json({
            success: false,
            message: `У специальности "${doctorSpecialty}" нет прав на действие: ${requiredPermission}`,
          });
        }

        next();
      };
    },
  };
};
