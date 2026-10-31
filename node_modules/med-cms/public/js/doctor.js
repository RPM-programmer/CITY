document.addEventListener("DOMContentLoaded", () => {
  loadSchedule();
  loadDiseasesCatalog();
  loadDoctorProfile();
});
async function loadDiseasesCatalog() {
  try {
    const res = await fetch("/med/api/doctor/diseases-list", {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    const result = await res.json();
    const select = document.getElementById("examDisease");
    select.innerHTML =
      '<option value="">-- Выберите диагноз из справочника МКБ --</option>';
    if (result.success && result.data.length > 0) {
      result.data.forEach((disease) => {
        const opt = document.createElement("option");
        opt.value = disease.id;
        opt.textContent = `[${disease.code}] ${disease.name}`;
        select.appendChild(opt);
      });
      console.log(
        `🌱 [АРМ Врача] Успешно загружено ${result.data.length} диагнозов из SQLite таблицы.`,
      );
    } else {
      select.innerHTML =
        '<option value="">Справочник болезней пуст (Запустите миграцию)</option>';
    }
  } catch (err) {
    console.error("❌ Ошибка при получении справочника болезней:", err);
  }
}
async function loadSchedule() {
  try {
    const res = await fetch("/med/api/doctor/schedule", {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    const data = await res.json();
    const list = document.getElementById("scheduleList");
    list.innerHTML = "";
    if (data.success && data.schedule && data.schedule.length > 0) {
      data.schedule.forEach((ap) => {
        const li = document.createElement("li");
        li.innerHTML = `<b>${ap.time}</b> - ${ap.Patient.fullName} 
                                <button onclick="startExamination('${ap.id}', '${ap.Patient.fullName}')" class="btn-action">Принять</button>`;
        list.appendChild(li);
      });
    } else {
      list.innerHTML = "<li>Ближайших записей на сегодня нет</li>";
    }
  } catch (err) {
    console.error("Ошибка загрузки расписания:", err);
  }
}
document.getElementById("examForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const selectedDiseaseId = document.getElementById("examDisease").value;
  const payload = {
    appointmentId: document.getElementById("activeAppointmentId").value,
    complaints: document.getElementById("examComplaints").value,
    objectively: document.getElementById("examObjective").value,
    doctorNotes: document.getElementById("examNotes").value,
    diseaseId: selectedDiseaseId ? parseInt(selectedDiseaseId, 10) : null,
  };
  try {
    const res = await fetch("/med/api/doctor/complete-examination", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Bypass-Tunnel-Reminder": "true",
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result.success) {
      alert(
        "Прием успешно завершен! Карточка обновлена, статистика внесена в SQLite.",
      );
      document.getElementById("examBlock").classList.add("hidden");
      document.getElementById("examForm").reset();
      await loadSchedule();
    } else {
      alert("Ошибка завершения приема: " + result.error);
    }
  } catch (err) {
    alert("Ошибка сети при отправке данных осмотра");
  }
});
function startExamination(appointmentId, patientName) {
  document.getElementById("examBlock").classList.remove("hidden");
  document.getElementById("activeAppointmentId").value = appointmentId;
  document.getElementById("currentPatientName").textContent = patientName;
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
async function loadDoctorProfile() {
  try {
    const res = await fetch("/med/api/doctor/me", {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    const result = await res.json();
    if (result.success && result.doctor) {
      document.getElementById("doctorName").textContent =
        result.doctor.fullName;
      document.getElementById("doctorPosition").textContent =
        result.doctor.position || "Врач";
    }
  } catch (err) {
    console.error("Ошибка загрузки профиля сотрудника:", err);
  }
}
function togglePasswordModal() {
  const modal = document.getElementById("passwordModal");
  modal.classList.toggle("hidden");
  document.getElementById("changePasswordForm").reset();
}
document
  .getElementById("changePasswordForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    try {
      const response = await fetch("/med/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const result = await response.json();
      if (result.success) {
        alert("Ваш пароль успешно изменен в базе данных SQLite!");
        togglePasswordModal();
      } else {
        alert("Ошибка смены пароля: " + result.message);
      }
    } catch (err) {
      alert("Ошибка сети при попытке изменить пароль");
    }
  });
