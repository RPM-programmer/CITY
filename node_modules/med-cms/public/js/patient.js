document.addEventListener("DOMContentLoaded", () => {
  loadPatientData();
  loadDoctorsForBooking();
});
async function loadPatientData() {
  try {
    const response = await fetch("/med/api/patient/me", {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    const result = await response.json();

    if (!result.success) {
      const errorText = result.error || result.message || "Неизвестная ошибка";
      alert("Ошибка загрузки данных: " + errorText);
      window.location.href = "/med/med-login";
      return;
    }
    const data = result.data;
    document.getElementById("patientName").textContent =
      data.personalInfo.fullName;
    document.getElementById("patientEmail").textContent =
      data.personalInfo.email;
    const districtInfo = document.getElementById("districtInfo");
    if (data.personalInfo.UserAddress) {
      const addr = data.personalInfo.UserAddress;
      districtInfo.innerHTML = `
                <p><b>Ваш адрес:</b> г. ${addr.city}, ул. ${addr.street}, д. ${addr.houseNumber}</p>
                <p style="margin-top: 10px;">🩺 <span class="badge">${addr.assignedDistrict}</span></p>
                <p style="margin-top: 10px;">🚪 <span class="badge" style="background:#ecfdf5; color:#065f46;">${addr.assignedCabinet}</span></p>
            `;
      document.getElementById("addrCity").value = addr.city;
      document.getElementById("addrStreet").value = addr.street;
      document.getElementById("addrHouse").value = addr.houseNumber;
    }
    const historyContainer = document.getElementById("medicalHistoryList");
    historyContainer.innerHTML = "";
    if (data.medicalHistory && data.medicalHistory.length > 0) {
      data.medicalHistory.forEach((record) => {
        const card = document.createElement("div");
        if (record.status === "ожидается") {
          card.className = "record-card future";
          card.innerHTML = `
                        <div style="display:flex; justify-content:space-between; font-weight:bold; color:#047857;">
                            <span>📅 Предстоящий прием: ${record.date} в ${record.time}</span>
                            <span>Статус: ожидается</span>
                        </div>
                        <p style="margin: 5px 0 0 0;"><b>Врач:</b> ${record.Doctor.fullName} (${record.Doctor.specialty})</p>
                    `;
        } else if (record.status === "завершен") {
          card.className = "record-card";
          card.innerHTML = `
                        <div style="display:flex; justify-content:space-between; font-weight:bold; color:#1e3a8a; margin-bottom: 8px;">
                            <span>🩺 Осмотр от ${record.date} в ${record.time}</span>
                            <span style="color:#2563eb;">Диагноз: [${record.Disease.code}] ${record.Disease.name}</span>
                        </div>
                        <p style="margin: 4px 0;"><b>Врач:</b> ${record.Doctor.fullName} (${record.Doctor.specialty})</p>
                        <p style="margin: 4px 0; font-size:14px;"><b>Жалобы:</b> ${record.complaints || "—"}</p>
                        <p style="margin: 4px 0; font-size:14px;"><b>Данные осмотра:</b> ${record.objectively || "—"}</p>
                        <div style="margin-top:8px; padding:8px; background:#f1f5f9; border-radius:4px; font-size:13px;">
                            <p style="margin:0 0 4px 0;">💊 <b>Рекомендации и лекарства:</b> ${record.Disease.treatmentRecommendations}</p>
                            <p style="margin:0;"><b>Назначено:</b> ${record.Disease.recommendedMedications}</p>
                        </div>
                    `;
        }
        historyContainer.appendChild(card);
      });
    } else {
      historyContainer.innerHTML =
        '<p style="color: #64748b;">У вас пока нет записей в медицинской карте.</p>';
    }
  } catch (err) {
    console.error("Ошибка связи с сервером:", err);
    alert("Критическая ошибка фронтенда при разборе JSON");
  }
}
document.getElementById("addressForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    city: document.getElementById("addrCity").value,
    street: document.getElementById("addrStreet").value,
    houseNumber: document.getElementById("addrHouse").value,
  };
  try {
    const response = await fetch("/med/api/patient/address", {
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
        "Адрес сохранен! Система автоматически пересчитала ваш лечебный участок.",
      );
      loadPatientData();
    } else {
      alert("Ошибка: " + result.error);
    }
  } catch (err) {
    alert("Ошибка сети при отправке адреса");
  }
});
async function logout() {
  await fetch("/med/api/auth/logout", {
    method: "POST",
    headers: {
      "Bypass-Tunnel-Reminder": "true",
    },
  });
  window.location.href = "/med/med-login";
}
async function loadDoctorsForBooking() {
  try {
    const response = await fetch("/med/api/patient/doctors-list", {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    const result = await response.json();
    const select = document.getElementById("bookingDoctor");
    select.innerHTML = '<option value="">-- Выберите врача --</option>';
    if (result.success && result.data.length > 0) {
      result.data.forEach((doc) => {
        const opt = document.createElement("option");
        opt.value = doc.id;
        const clinicInfo = doc.Clinic ? ` (${doc.Clinic.name})` : "";
        opt.textContent = `${doc.specialty} — ${doc.fullName}${clinicInfo}`;
        select.appendChild(opt);
      });
    } else {
      select.innerHTML =
        '<option value="">Врачи пока не зарегистрированы в CMS</option>';
    }
  } catch (err) {
    console.error("Ошибка загрузки врачей:", err);
  }
}
document.getElementById("bookingForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    doctorId: document.getElementById("bookingDoctor").value,
    date: document.getElementById("bookingDate").value,
    time: document.getElementById("bookingTime").value,
  };
  try {
    const response = await fetch("/med/api/patient/book", {
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
        "Вы успешно записаны на прием! Талон добавлен в вашу медицинскую карту.",
      );
      document.getElementById("bookingForm").reset();
      await loadPatientData();
    } else {
      alert("Ошибка бронирования: " + result.error);
    }
  } catch (err) {
    alert("Ошибка сети при попытке записи");
  }
});
