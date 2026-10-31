const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require(
  path.join(__dirname, "..", "database", "config", "db-init.js"),
);
const createMiddleware = require(path.join(__dirname, "midleware"));
const { MED_PERMISSIONS } = require(path.join(__dirname, "permissions"));
const AdminService = require(
  path.join(__dirname, "..", "database", "services", "admin"),
);
const DoctorService = require(
  path.join(__dirname, "..", "database", "services", "doctor"),
);
const PatientService = require(
  path.join(__dirname, "..", "database", "services", "patient"),
);
function createMedRouter(jwtSecret) {
  const api = express.Router();
  const web = express.Router();
  const { User, Disease, Clinic, Appointment, UserAddress, District, News } =
    db;
  web.use("/", express.static(path.join(__dirname, "..", "public")));
  const { verifyCookie, requireRole, checkPermission } =
    createMiddleware(jwtSecret);

  api.post("/auth/register", async (req, res) => {
    try {
      const { email, password, fullName } = req.body;
      if (!email || !password || !fullName)
        throw new Error(
          "Заполните обязательные поля: email, password, fullName",
        );
      const candidate = await User.findOne({ where: { email } });
      if (candidate)
        return res
          .status(400)
          .json({ success: false, message: "Email уже занят" });
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        email,
        password: hashedPassword,
        fullName,
        role: "patient",
      });
      res.status(201).json({ success: true, message: "Регистрация успешна" });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  api.post("/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res
          .status(400)
          .json({ success: false, message: "Неверный логин или пароль" });
      }
      const token = jwt.sign(
        { id: user.id, role: user.role, specialty: user.specialty },
        jwtSecret,
        { expiresIn: "7d" },
      );
      res.cookie("med_auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
      });
      res.json({
        success: true,
        user: { id: user.id, fullName: user.fullName, role: user.role },
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  api.post("/auth/logout", (req, res) => {
    res.clearCookie("med_auth_token");
    res.json({ success: true, message: "Успешный выход" });
  });

  web.get(
    "/med-patient",
    verifyCookie,
    requireRole(["patient"]),
    (req, res) => {
      res.sendFile(
        path.join(__dirname, "..", "public", "html", "dashboard-patient.html"),
      );
    },
  );
  api.get("/patient/me", verifyCookie, async (req, res) => {
    try {
      const fullData = await PatientService.getFullMyData(req.user.id);
      res.json({ success: true, data: fullData });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  api.post("/patient/address", verifyCookie, async (req, res) => {
    try {
      const updatedAddress = await PatientService.savePatientAddress(
        req.user.id,
        req.body,
      );
      res.json({ success: true, address: updatedAddress });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  web.get("/med-doctor", verifyCookie, requireRole(["doctor"]), (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "public", "html", "dashboard-doctor.html"),
    );
  });

  api.get(
    "/doctor/schedule",
    verifyCookie,
    requireRole(["doctor"]),
    async (req, res) => {
      try {
        const schedule = await DoctorService.getMySchedule(req.user.id);
        res.json({ success: true, schedule });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    },
  );

  api.get(
    "/doctor/patient-history/:id",
    verifyCookie,
    requireRole(["doctor"]),
    async (req, res) => {
      try {
        const history = await DoctorService.getPatientHistory(req.params.id);
        res.json({ success: true, history });
      } catch (err) {
        res.status(404).json({ success: false, error: err.message });
      }
    },
  );

  api.post(
    "/doctor/complete-examination",
    verifyCookie,
    requireRole(["doctor"]),
    async (req, res) => {
      try {
        const result = await DoctorService.saveExamination(req.body);
        res.json({ success: true, appointment: result });
      } catch (err) {
        res.status(400).json({ success: false, error: err.message });
      }
    },
  );

  api.post(
    "/doctor/schedule-surgery",
    verifyCookie,
    requireRole(["doctor"]),
    checkPermission(MED_PERMISSIONS.SCHEDULE_SURGERY),
    (req, res) => {
      res.json({
        success: true,
        message:
          "Операция успешно добавлена в график хирургического отделения.",
      });
    },
  );

  web.get("/med-admin", verifyCookie, requireRole(["admin"]), (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "public", "html", "dashboard-admin.html"),
    );
  });

  api.post(
    "/admin/clinics",
    verifyCookie,
    requireRole(["admin"]),
    async (req, res) => {
      try {
        const newClinic = await AdminService.createClinic(req.body);
        res.status(201).json({ success: true, data: newClinic });
      } catch (err) {
        res.status(400).json({ success: false, error: err.message });
      }
    },
  );

  api.post(
    "/admin/staff",
    verifyCookie,
    requireRole(["admin"]),
    async (req, res) => {
      try {
        if (req.body.clinicId && !req.body.ClinicId) {
          req.body.ClinicId = req.body.clinicId;
        }
        const staffUser = await AdminService.createStaffAccount(req.body);
        res.status(201).json({ success: true, data: staffUser });
      } catch (err) {
        res.status(400).json({ success: false, error: err.message });
      }
    },
  );

  api.delete(
    "/admin/users/:id",
    verifyCookie,
    requireRole(["admin"]),
    async (req, res) => {
      try {
        const result = await AdminService.deleteAccount(req.params.id);
        res.json(result);
      } catch (err) {
        res.status(400).json({ success: false, error: err.message });
      }
    },
  );

  api.get(
    "/admin/stats",
    verifyCookie,
    requireRole(["admin"]),
    async (req, res) => {
      try {
        const stats = await AdminService.getSystemStats();
        res.json({ success: true, stats });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    },
  );
  api.get(
    "/admin/list-clinics",
    verifyCookie,
    requireRole(["admin"]),
    async (req, res) => {
      try {
        const clinics = await Clinic.findAll({ order: [["name", "ASC"]] });
        res.json({ success: true, data: clinics });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    },
  );

  api.get(
    "/admin/list-staff",
    verifyCookie,
    requireRole(["admin"]),
    async (req, res) => {
      try {
        const staff = await User.findAll({
          where: { role: "doctor" },
          include: [{ model: Clinic, attributes: ["name"] }],
          order: [["fullName", "ASC"]],
        });
        res.json({ success: true, data: staff });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    },
  );

  api.get(
    "/patient/doctors-list",
    verifyCookie,
    requireRole(["patient"]),
    async (req, res) => {
      try {
        const doctors = await User.findAll({
          where: { role: "doctor" },
          attributes: ["id", "fullName", "specialty"],
          include: [{ model: Clinic, attributes: ["name", "address"] }],
        });
        res.json({ success: true, data: doctors });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    },
  );

  api.post(
    "/patient/book",
    verifyCookie,
    requireRole(["patient"]),
    async (req, res) => {
      try {
        const patientId = req.user.id;
        const appointment = await PatientService.bookAppointment(
          patientId,
          req.body,
        );
        res.status(212).json({ success: true, data: appointment });
      } catch (err) {
        res.status(400).json({ success: false, error: err.message });
      }
    },
  );

  api.get(
    "/doctor/diseases-list",
    verifyCookie,
    requireRole(["doctor", "admin"]),
    async (req, res) => {
      try {
        const diseases = await Disease.findAll({ order: [["name", "ASC"]] });
        res.json({ success: true, data: diseases });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    },
  );

  api.post("/auth/change-password", verifyCookie, async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!oldPassword || !newPassword) {
        throw new Error("Необходимо указать старый и новый пароли");
      }

      const user = await User.findByPk(userId);
      if (!user) throw new Error("Пользователь не найден");

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Старый пароль введен неверно" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await user.update({
        password: hashedNewPassword,
        isTemporaryPassword: false,
      });
      res.json({ success: true, message: "Пароль успешно изменен" });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  api.get(
    "/doctor/me",
    verifyCookie,
    requireRole(["doctor"]),
    async (req, res) => {
      try {
        // Используем модель User, полученную онлайн из db
        const doctorData = await User.findByPk(req.user.id, {
          attributes: ["fullName", "position", "specialty"],
        });
        res.json({ success: true, doctor: doctorData });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    },
  );

  // 1. Создать лечебный участок с привязкой к клинике, улице и кабинету (Для админа)
  api.post(
    "/admin/districts",
    verifyCookie,
    requireRole(["admin"]),
    async (req, res) => {
      try {
        const { name, city, street, houses, cabinet, doctorName, clinicId } =
          req.body;

        if (!name || !city || !street || !cabinet || !clinicId) {
          throw new Error(
            "Заполните обязательные поля: Название, Город, Улица, Кабинет, ID Клиники",
          );
        }

        const clinicExists = await Clinic.findByPk(clinicId);
        if (!clinicExists)
          throw new Error(
            `Медицинское учреждение с ID №${clinicId} не найдено.`,
          );

        const newDistrict = await District.create({
          name,
          city,
          street,
          houses,
          cabinet,
          doctorName,
          ClinicId: parseInt(clinicId, 10),
        });

        res.status(201).json({ success: true, data: newDistrict });
      } catch (err) {
        res.status(400).json({ success: false, error: err.message });
      }
    },
  );

  api.get(
    "/admin/districts/:clinicId",
    verifyCookie,
    requireRole(["admin"]),
    async (req, res) => {
      try {
        const list = await District.findAll({
          where: { ClinicId: req.params.clinicId },
          order: [["name", "ASC"]],
        });
        res.json({ success: true, data: list });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    },
  );
  api.get("/public/news-list", async (req, res) => {
    try {
      const { News } = db;
      const news = await News.findAll({ order: [["createdAt", "DESC"]] });
      res.json({ success: true, data: news });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  api.post(
    "/admin/news",
    verifyCookie,
    requireRole(["admin"]),
    async (req, res) => {
      try {
        const { News } = db;
        const { title, content } = req.body;
        if (!title || !content)
          throw new Error("Заполните заголовок и текст новости");
        const newPost = await News.create({ title, content });
        res.status(201).json({ success: true, data: newPost });
      } catch (err) {
        res.status(400).json({ success: false, error: err.message });
      }
    },
  );
  api.delete(
    "/admin/news/:id",
    verifyCookie,
    requireRole(["admin"]),
    async (req, res) => {
      try {
        const { News } = db;
        await News.destroy({ where: { id: req.params.id } });
        res.json({ success: true, message: "Новость удалена" });
      } catch (err) {
        res.status(400).json({ success: false, error: err.message });
      }
    },
  );
  web.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "html", "home.html"));
  });
  api.get(
    "/admin/list-districts",
    verifyCookie,
    requireRole(["admin"]),
    async (req, res) => {
      try {
        const { District, Clinic } = db;
        if (!District) {
          throw new Error(
            "Модель District еще не инициализирована в ядре базы данных",
          );
        }
        const list = await District.findAll({
          include: [{ model: Clinic, attributes: ["name"] }],
          order: [["createdAt", "DESC"]],
        });
        res.json({ success: true, data: list });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    },
  );
  api.get("/public/check-district", async (req, res) => {
    try {
      const { clinicId, city, street, house } = req.query;
      const District = db.models.District || db.District;
      if (!District) {
        throw new Error(
          "Модель District еще не инициализирована в ядре базы данных",
        );
      }
      const cleanCity = city ? city.trim().toUpperCase() : "";
      const cleanStreet = street ? street.trim().toUpperCase() : "";
      const cleanHouse = house ? house.trim().toLowerCase() : "";
      if (!cleanCity || !cleanStreet || !cleanHouse) {
        throw new Error(
          "Для проверки необходимо заполнить город, улицу и номер дома",
        );
      }
      const districts = await District.findAll({
        where: db.sequelize.and(
          { ClinicId: parseInt(clinicId, 10) },
          db.sequelize.where(
            db.sequelize.fn("UPPER", db.sequelize.col("city")),
            cleanCity,
          ),
          db.sequelize.where(
            db.sequelize.fn("UPPER", db.sequelize.col("street")),
            cleanStreet,
          ),
        ),
      });
      for (const dist of districts) {
        const dbHouses = dist.houses.trim().toLowerCase();
        if (dbHouses === "все" || dbHouses === "все дома") {
          return res.json({
            success: true,
            data: {
              assignedDistrict: dist.name,
              assignedCabinet: `${dist.cabinet} (Врач: ${dist.doctorName || "Не назначен"})`,
            },
          });
        }
        if (dbHouses.includes("-")) {
          const [min, max] = dbHouses
            .split("-")
            .map((num) => parseInt(num.trim(), 10));
          const userHouseNum = parseInt(cleanHouse, 10);
          if (!isNaN(min) && !isNaN(max) && !isNaN(userHouseNum)) {
            if (userHouseNum >= min && userHouseNum <= max) {
              return res.json({
                success: true,
                data: {
                  assignedDistrict: dist.name,
                  assignedCabinet: `${dist.cabinet} (Врач: ${dist.doctorName || "Не назначен"})`,
                },
              });
            }
          }
        }
        if (dbHouses === cleanHouse) {
          return res.json({
            success: true,
            data: {
              assignedDistrict: dist.name,
              assignedCabinet: `${dist.cabinet} (Врач: ${dist.doctorName || "Не назначен"})`,
            },
          });
        }
      }
      res.json({
        success: true,
        data: {
          assignedDistrict: "Участок распределения по домам",
          assignedCabinet: "пройдите в регистратуру",
        },
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  api.get("/info/contact/", (req, res) => {
    res.json({
      gmail: process.env.ADMIN_GMAIL,
      phone: process.env.ADMIN_PHONE,
    });
  });
  web.get("/home", async (req, res) => {
    res.redirect("/med/html/home.html");
  });
  web.get("/general", async (req, res) => {
    res.redirect("/med/html/home.html");
  });
  web.get("/h", async (req, res) => {
    res.redirect("/med/html/home.html");
  });
  web.get("/главная", async (req, res) => {
    res.redirect("/med/html/home.html");
  });
  web.get("/Главная", async (req, res) => {
    res.redirect("/med/html/home.html");
  });
  web.get("/Home", async (req, res) => {
    res.redirect("/med/html/home.html");
  });
  web.get("/login", async (req, res) => {
    res.redirect("/med/html/login.html");
  });
  web.get("/вход", async (req, res) => {
    res.redirect("/med/html/login.html");
  });
  web.get("/med-login", async (req, res) => {
    res.redirect("/med/html/login.html");
  });

  return { web: web, api: api };
}
module.exports = createMedRouter;
