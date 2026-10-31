// Инициализация дашборда: строго один слушатель, который запускает всё по очереди
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 [Admin] Запуск инициализации панелей...");
  await loadDashboardStats();
  await loadClinicsDropdown();
  await loadClinicsForDistrictsSelect();
  await loadStaffForDistrictsSelect();
  await renderLiveDistrictsTable();
});

// Базовая статистика верхних карточек
async function loadDashboardStats() {
  try {
    const response = await fetch("/med/api/admin/stats", {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    const result = await response.json();
    if (!result.success) {
      alert("Ошибка доступа к админ-панели: " + result.message);
      window.location.href = "/med/med-login";
      return;
    }
    document.getElementById("statClinics").textContent =
      result.stats.summary.totalClinics;
    document.getElementById("statPatients").textContent =
      result.stats.summary.totalPatients;
    document.getElementById("statStaff").textContent =
      result.stats.summary.totalStaff;
  } catch (err) {
    console.error("Ошибка загрузки статистики:", err);
  }
}

// Загрузка клиник в форму №2 (Создание сотрудника)
async function loadClinicsDropdown() {
  try {
    const response = await fetch("/med/api/admin/list-clinics", {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    const result = await response.json();
    const select = document.getElementById("staffClinic");
    if (!select) return;

    select.innerHTML = '<option value="">-- Выберите больницу --</option>';
    if (result.success && result.data.length > 0) {
      result.data.forEach((clinic) => {
        const opt = document.createElement("option");
        opt.value = clinic.id;
        opt.textContent = `[ID: ${clinic.id}] ${clinic.name}`;
        select.appendChild(opt);
      });
    }
  } catch (err) {
    console.error("Ошибка наполнения списка клиник:", err);
  }
}

// Загрузка клиник в форму №5 (Конфигуратор участков)
async function loadClinicsForDistrictsSelect() {
  const select = document.getElementById("distClinicId");
  if (!select) return;
  try {
    const response = await fetch("/med/api/admin/list-clinics", {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    const result = await response.json();
    select.innerHTML =
      '<option value="">-- Выберите медицинское учреждение --</option>';
    if (result.success && result.data && result.data.length > 0) {
      result.data.forEach((clinic) => {
        const opt = document.createElement("option");
        opt.value = clinic.id;
        opt.textContent = `[ID: ${clinic.id}] ${clinic.name}`;
        select.appendChild(opt);
      });
    } else {
      select.innerHTML =
        '<option value="">Клиники не найдены. Создайте их в форме №1</option>';
    }
  } catch (err) {
    console.error("Ошибка заполнения селекта клиник:", err);
  }
}

// Загрузка существующих сотрудников в селект формы №5 (Конфигуратор участков)
async function loadStaffForDistrictsSelect() {
  const select = document.getElementById("distDoctor");
  if (!select) return;
  try {
    const response = await fetch("/med/api/admin/list-staff", {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    const result = await response.json();
    select.innerHTML =
      '<option value="">-- Выберите сотрудника из базы данных --</option>';
    if (result.success && result.data && result.data.length > 0) {
      result.data.forEach((staff) => {
        const opt = document.createElement("option");
        opt.value = staff.fullName;
        const clinicName = staff.Clinic ? staff.Clinic.name : "Без привязки";
        opt.textContent = `${staff.fullName} (${staff.position || "Врач"} — ${clinicName})`;
        select.appendChild(opt);
      });
      console.log(
        `✅ Селект сотрудников успешно обновлен: ${result.data.length} шт.`,
      );
    } else {
      select.innerHTML =
        '<option value="">Нет зарегистрированных сотрудников. Создайте их в форме №2</option>';
    }
  } catch (err) {
    console.error("Ошибка заполнения селекта сотрудников:", err);
  }
}

// Отрисовка интерактивной таблицы участков из SQLite
async function renderLiveDistrictsTable() {
  const container = document.getElementById("liveDistrictsTableBox");
  if (!container) return;
  try {
    const res = await fetch("/med/api/admin/list-districts", {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    const result = await res.json();
    if (result.success && result.data && result.data.length > 0) {
      let html = `
                <table style="width:100%; border-collapse:collapse; font-size:13px; margin-top:15px; text-align:left;">
                    <thead>
                        <tr style="background:#f1f5f9; color:#1e3a8a; border-bottom:2px solid #cbd5e1;">
                            <th style="padding:10px;">Медицинское учреждение</th>
                            <th style="padding:10px;">Название участка</th>
                            <th style="padding:10px;">Кабинет</th>
                            <th style="padding:10px;">Адрес покрытия</th>
                            <th style="padding:10px;">Дома</th>
                            <th style="padding:10px;">Закрепленный сотрудник</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
      result.data.forEach((d) => {
        const clinicName = d.Clinic
          ? d.Clinic.name
          : '<span style="color:red;">Не привязано</span>';
        html += `
                    <tr style="border-bottom:1px solid #cbd5e1;">
                        <td style="padding:10px;"><b>${clinicName}</b></td>
                        <td style="padding:10px;"><span class="uid-badge" style="background:#e0f2fe; color:#0369a1; padding:3px 6px; border-radius:4px; font-weight:bold;">${d.name}</span></td>
                        <td style="padding:10px;"><span class="uid-badge" style="background:#dcfce7; color:#15803d; padding:3px 6px; border-radius:4px; font-weight:bold;">${d.cabinet}</span></td>
                        <td style="padding:10px;">г. ${d.city}, ул. ${d.street}</td>
                        <td style="padding:10px;">д. ${d.houses}</td>
                        <td style="padding:10px; color:#475569;">👤 ${d.doctorName || "Не назначен"}</td>
                    </tr>
                `;
      });
      html += "</tbody></table>";
      container.innerHTML = html;
    } else {
      container.innerHTML =
        '<p style="color:#64748b; font-style:italic; margin:15px 0 0 0;">В системе пока нет настроенных участков покрытия клиник.</p>';
    }
  } catch (err) {
    console.error("Ошибка рендеринга таблицы участков:", err);
    container.innerHTML =
      '<p style="color:red; margin:15px 0 0 0;">Ошибка автоматического обновления таблицы участков</p>';
  }
}

// Форма 1: Создание клиники
document.getElementById("clinicForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    name: document.getElementById("clinicName").value,
    type: document.getElementById("clinicType").value,
    address: document.getElementById("clinicAddress").value,
  };
  try {
    const response = await fetch("/med/api/admin/clinics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Bypass-Tunnel-Reminder": "true",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (result.success) {
      alert(`Учреждение успешно добавлено в SQLite под ID №${result.data.id}!`);
      document.getElementById("clinicForm").reset();

      // АВТОМАТИКА: Обновляем карточки и выпадающие списки клиник во всех формах
      await loadDashboardStats();
      await loadClinicsDropdown();
      await loadClinicsForDistrictsSelect();
    } else {
      alert("Ошибка: " + result.error);
    }
  } catch (err) {
    alert("Ошибка сети при создании клиники");
    console.error(err);
  }
});

// Форма 2: Создание сотрудника
document.getElementById("staffForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const clinicSelect = document.getElementById("staffClinic");
  const selectedClinicId = clinicSelect.value;
  const selectedProfile = document.getElementById("staffMedicalProfile").value;
  if (!selectedClinicId) {
    alert("Пожалуйста, выберите больницу из списка!");
    return;
  }
  const payload = {
    fullName: document.getElementById("staffName").value,
    email: document.getElementById("staffEmail").value,
    rawPassword: document.getElementById("staffPassword").value,
    medicalProfile: selectedProfile,
    clinicId: parseInt(selectedClinicId, 10),
  };
  try {
    const response = await fetch("/med/api/admin/staff", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Bypass-Tunnel-Reminder": "true",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (result.success) {
      alert(`Сотрудник успешно создан!\nПрофиль: ${selectedProfile}`);
      document.getElementById("staffForm").reset();

      // АВТОМАТИКА: Мгновенно обновляем статистику и селект сотрудников в форме участков!
      await loadDashboardStats();
      await loadStaffForDistrictsSelect();
    } else {
      alert("Ошибка creation: " + result.error);
    }
  } catch (err) {
    alert("Ошибка сети при создании сотрудника");
  }
});

// Форма 4: Новости
document.getElementById("newsForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    title: document.getElementById("newsTitle").value,
    content: document.getElementById("newsContent").value,
  };
  try {
    const response = await fetch("/med/api/admin/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Bypass-Tunnel-Reminder": "true",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (result.success) {
      alert(
        `Новость "${result.data.title}" успешно опубликована в ленту главной страницы!`,
      );
      document.getElementById("newsForm").reset();
      await loadDashboardStats();
    } else {
      alert("Ошибка публикации новости: " + result.error);
    }
  } catch (err) {
    alert("Ошибка сети при попытке опубликовать новость");
  }
});

// Форма 5: Отправка участка
document
  .getElementById("districtForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      clinicId: document.getElementById("distClinicId").value,
      name: document.getElementById("distName").value,
      city: document.getElementById("distCity").value,
      street: document.getElementById("distStreet").value,
      houses: document.getElementById("distHouses").value,
      cabinet: document.getElementById("distCabinet").value,
      doctorName: document.getElementById("distDoctor").value,
    };
    try {
      const response = await fetch("/med/api/admin/districts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        alert(`Привязка для ${result.data.name} успешно зафиксирована!`);
        document.getElementById("districtForm").reset();
        await renderLiveDistrictsTable();
      } else {
        alert("Ошибка привязки участка: " + result.error);
      }
    } catch (err) {
      alert("Ошибка сети при отправке данных участка");
    }
  });
// Просмотр реестров в таблице
async function viewClinicsTable() {
  const block = document.getElementById("tableViewerBlock");
  const title = document.getElementById("tableViewerTitle");
  const content = document.getElementById("tableViewerContent");
  block.classList.remove("hidden");
  title.textContent = " 🏥 Реестр медицинских учреждений системы";
  content.innerHTML = "Загрузка таблицы...";
  try {
    const res = await fetch("/med/api/admin/list-clinics", {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    const result = await res.json();
    if (result.success && result.data.length > 0) {
      let html =
        "<table><thead><tr><th>ID Клиники</th><th>Название</th><th>Тип</th><th>Адрес</th></tr></thead><tbody>";
      result.data.forEach((c) => {
        html += `<tr><td><span class="uid-badge">${c.id}</span></td><td><b>${c.name}</b></td><td>${c.type}</td><td>${c.address}</td></tr>`;
      });
      html += "";
      content.innerHTML = html;
    } else {
      content.innerHTML = "В базе данных пока нет созданных учреждений.";
    }
  } catch (err) {
    content.innerHTML = "Ошибка загрузки данных клиник";
  }
}
async function viewStaffTable() {
  const block = document.getElementById("tableViewerBlock");
  const title = document.getElementById("tableViewerTitle");
  const content = document.getElementById("tableViewerContent");
  block.classList.remove("hidden");
  title.textContent = "👨‍⚕️ Зарегистрированный медицинский персонал";
  content.innerHTML = "Загрузка таблицы...";
  try {
    const res = await fetch("/med/api/admin/list-staff", {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    const result = await res.json();
    if (result.success && result.data.length > 0) {
      let html = `<table><thead><tr><th>ID Сотрудника</th><th>ФИО</th><th>Email</th><th>Должность</th><th>Специализация</th><th>Место работы</th></tr></thead><tbody>`;
      result.data.forEach((s) => {
        const clinicName = s.Clinic ? s.Clinic.name : "Не привязан";
        html += `
          <tr>
            <td>
              <span class="uid-badge">${s.id}</span>
            </td>
            <td>
              <b>${s.fullName}</b>
            </td>
            <td>${s.email}</td>
            <td>
              <span class="badge" style="background:#f1f5f9; color:#475569;">
                ${s.position || "Врач"}
              </span>
            </td>
            <td>${s.specialty || "Нет"}</td>
            <td>${clinicName}</td>
          </tr>
        `;
      });
      html += "";
      content.innerHTML = html;
    } else {
      content.innerHTML =
        "В штате системы пока нет зарегистрированных сотрудников.";
    }
  } catch (err) {
    content.innerHTML = "Ошибка загрузки данных персонала";
  }
}
async function logout() {
  await fetch("/med/api/auth/logout", {
    method: "POST",
    headers: {
      "Bypass-Tunnel-Reminder": "true",
    },
  });
  window.location.href = "/med/html/login.html";
}
