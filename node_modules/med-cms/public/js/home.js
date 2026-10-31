document.addEventListener("DOMContentLoaded", () => {
  loadLiveNews();
});
async function loadLiveNews() {
  const box = document.getElementById("news-box");
  box.innerHTML =
    '<p style="color: #64748b;">Загрузка свежих новостей клиники...</p>';
  try {
    const res = await fetch("/med/api/public/news-list", {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    const result = await res.json();
    if (result.success && result.data.length > 0) {
      let html = "";
      result.data.forEach((post) => {
        const date = new Date(post.createdAt).toLocaleDateString("ru-RU");
        html += `
                    <div style="margin-bottom: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px;">
                        <span style="font-size:12px; color:#64748b;">📅 Опубликовано: ${date}</span>
                        <h2 style="margin: 5px 0 10px 0; color:#1e3a8a;">${post.title}</h2>
                        <p style="line-height: 1.6; color:#475569; margin:0;">${post.content}</p>
                    </div>
                `;
      });
      box.innerHTML = html;
    } else {
      box.innerHTML =
        '<h2>Лента новостей</h2><p style="color:#64748b;">На данный момент новостей и объявлений нет.</p>';
    }
  } catch (err) {
    console.error("Ошибка загрузки новостей:", err);
    box.innerHTML =
      '<p style="color:red;">Не удалось загрузить ленту новостей сервера.</p>';
  }
}
function switchSection(sectionKey, element) {
  document
    .querySelectorAll(".nav-btn")
    .forEach((btn) => btn.classList.remove("active"));
  element.classList.add("active");
  const elements = {
    news: document.getElementById("news-box"),
    about: document.getElementById("about-box"),
    info: document.getElementById("info-box"),
    contact: document.getElementById("contacts-box"),
  };
  if (sectionKey === "news" && typeof loadLiveNews === "function") {
    loadLiveNews();
  }
  Object.keys(elements).forEach((key) => {
    if (elements[key]) {
      elements[key].style.display = key === sectionKey ? "block" : "none";
    }
  });
}
async function checkDistrictOnline() {
  const city = document.getElementById("checkCityInput").value;
  const street = document.getElementById("checkStreetInput").value;
  const house = document.getElementById("checkHouseInput").value;
  const resultBox = document.getElementById("checkResultBox");
  if (!city || !street || !house) {
    resultBox.innerHTML =
      '<span style="color:red;">Заполните все три поля: Город, Улица, Дом!</span>';
    return;
  }
  resultBox.innerHTML = "Проверка адреса в SQLite...";
  try {
    const url = `/med/api/public/check-district?clinicId=1&city=${encodeURIComponent(city)}&street=${encodeURIComponent(street)}&house=${encodeURIComponent(house)}`;
    const res = await fetch(url, {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    const result = await res.json();
    if (result.success) {
      resultBox.innerHTML = `🩺 ${result.data.assignedDistrict} <br> 🚪 ${result.data.assignedCabinet}`;
    } else {
      resultBox.innerHTML = `<span style="color:red;">Ошибка: ${result.error}</span>`;
    }
  } catch (err) {
    console.error(err);
    resultBox.innerHTML =
      '<span style="color:red;">Ошибка соединения с базой данных</span>';
  }
}
