/* =========================================================
   0. УЛЬТРА-ЖЕСТКАЯ СИСТЕМА ОТКЛЮЧЕНИЯ АНИМАЦИЙ ДЛЯ СЛАБЫХ УСТРОЙСТВ
   ========================================================= */
let isAnimationsDisabled = false;
let trafficTimeoutId = null;

function disableAllAnimations(reason) {
  if (isAnimationsDisabled) return;
  isAnimationsDisabled = true;

  if (trafficTimeoutId) {
    clearTimeout(trafficTimeoutId);
  }

  const road = document.getElementById("road");
  if (road) {
    road.innerHTML = "";
  }

  document.body.classList.add("no-animations");
  console.warn(
    `[CITY UI] Анимации принудительно отключены. Причина: ${reason}`,
  );
}

// 1. МАКСИМАЛЬНО ЖЕСТКАЯ ПРОВЕРКА ПРИ ЗАГРУЗКЕ
function checkInitialDevicePerformance() {
  const ram = navigator.deviceMemory;
  const cores = navigator.hardwareConcurrency;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isSaveData = navigator.connection && navigator.connection.saveData;

  // Определяем ЛЮБОЙ планшет или телефон (включая iPad/Android в режиме ПК)
  const isTouchDevice =
    navigator.maxTouchPoints > 0 || "ontouchstart" in window;
  const isMobileUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  // ОТКЛЮЧАЕМ АНИМАЦИИ НА ВСЕХ ПЛАНШЕТАХ И ТЕЛЕФОНАХ БЕЗ ИСКЛЮЧЕНИЙ
  if (isTouchDevice || isMobileUA) {
    disableAllAnimations(
      "Мобильное устройство или планшет (защита от лагов GPU)",
    );
    return;
  }

  // На ПК отключаем, если мало оперативки (<= 4 ГБ) или мало ядер (< 4)
  if (
    (ram && ram <= 4) ||
    (cores && cores < 4) ||
    prefersReducedMotion ||
    isSaveData
  ) {
    disableAllAnimations("Недостаточно ресурсов ПК или режим экономии");
    return;
  }
}

// 2. МОНИТОРИНГ ЗАПОЛНЕННОСТИ ПАМЯТИ ВКЛАДКИ (ДЛЯ ПК)
function startMemoryMonitor() {
  if (!performance || !performance.memory) return;

  const memoryInterval = setInterval(() => {
    if (isAnimationsDisabled) {
      clearInterval(memoryInterval);
      return;
    }

    const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
    if (usedJSHeapSize / jsHeapSizeLimit > 0.7) {
      disableAllAnimations("Высокое потребление памяти вкладкой");
      clearInterval(memoryInterval);
    }
  }, 1500);
}

// 3. ЖЕСТКИЙ МОНИТОРИНГ FPS И МИКРОФРИЗОВ (ДЛЯ ПК)
function startFpsMonitor() {
  let frameCount = 0;
  let lastTime = performance.now();
  let lastFrameTime = performance.now();
  let stutterCount = 0;

  function checkFrame(now) {
    if (isAnimationsDisabled) return;

    if (document.hidden) {
      frameCount = 0;
      lastTime = now;
      lastFrameTime = now;
      requestAnimationFrame(checkFrame);
      return;
    }

    const frameDelta = now - lastFrameTime;
    if (frameDelta > 28) {
      stutterCount++;
      if (stutterCount >= 4) {
        disableAllAnimations(
          `Обнаружены рывки кадров (задержка ${Math.round(frameDelta)} мс)`,
        );
        return;
      }
    }
    lastFrameTime = now;

    frameCount++;
    const elapsed = now - lastTime;

    if (elapsed >= 500) {
      const currentFps = Math.round((frameCount * 1000) / elapsed);
      if (currentFps < 50) {
        disableAllAnimations(`Низкий FPS (${currentFps})`);
        return;
      }
      stutterCount = Math.max(0, stutterCount - 1);
      frameCount = 0;
      lastTime = now;
    }

    requestAnimationFrame(checkFrame);
  }

  requestAnimationFrame(checkFrame);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden && !isAnimationsDisabled) {
    const road = document.getElementById("road");
    if (road) road.innerHTML = "";
  }
});

/* =========================================================
   1. УПРАВЛЕНИЕ ВЫПАДАЮЩИМ МЕНЮ "СЕРВИСЫ"
   ========================================================= */
function toggleDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById("servicesDropdown");
  if (dropdown) {
    dropdown.classList.toggle("active");
  }
}

window.onclick = function (event) {
  const dropdown = document.getElementById("servicesDropdown");
  if (dropdown && dropdown.classList.contains("active")) {
    dropdown.classList.remove("active");
  }
};

/* =========================================================
   2. СИСТЕМА ДВИЖЕНИЯ 12 ГОРОДСКИХ МАШИН
   ========================================================= */
const fleet = [
  {
    type: "car-civilian",
    speedVariants: [
      { className: "speed-civilian-slow", lifetime: 8000 },
      { className: "speed-civilian-medium", lifetime: 6000 },
      { className: "speed-civilian-fast", lifetime: 4500 },
    ],
    weight: 70.5,
  },
  {
    type: "car-minibus",
    speedVariants: [{ className: "speed-civilian-medium", lifetime: 6000 }],
    weight: 10,
  },
  { type: "car-bus", speedClass: "speed-slow", lifetime: 10000, weight: 7 },
  {
    type: "car-trolleybus",
    speedClass: "speed-slow",
    lifetime: 10000,
    weight: 7,
  },
  {
    type: "car-taxi",
    speedVariants: [
      { className: "speed-civilian-slow", lifetime: 8000 },
      { className: "speed-civilian-medium", lifetime: 6000 },
      { className: "speed-civilian-fast", lifetime: 4500 },
    ],
    weight: 4,
  },
  {
    type: "car-service",
    speedClass: "speed-slow",
    lifetime: 9000,
    weight: 0.5,
  },
  {
    type: "car-medical",
    speedClass: "speed-fast",
    lifetime: 3500,
    weight: 0.5,
  },
  { type: "car-fire", speedClass: "speed-fast", lifetime: 4000, weight: 0.5 },
];

let lastCarType = "";
const MAX_CARS_ON_ROAD = 12;

function getRandomCar() {
  let availableCars = fleet.filter((car) => car.type !== lastCarType);
  let totalWeight = availableCars.reduce((sum, car) => sum + car.weight, 0);
  let randomNum = Math.random() * totalWeight;
  let weightCounter = 0;

  for (let car of availableCars) {
    weightCounter += car.weight;
    if (randomNum <= weightCounter) {
      return car;
    }
  }
  return availableCars;
}

function spawnCar() {
  if (isAnimationsDisabled || document.hidden) return;

  const road = document.getElementById("road");
  if (!road) return;

  const currentCarsCount = road.getElementsByClassName("traffic-car").length;
  if (currentCarsCount >= MAX_CARS_ON_ROAD) return;

  const car = document.createElement("div");
  car.classList.add("traffic-car");

  const activeCar = getRandomCar();
  lastCarType = activeCar.type;

  car.classList.add(activeCar.type);

  const laneOffset = Math.floor(Math.random() * 13) - 6;
  car.style.bottom = `${-4 + laneOffset}px`;

  let finalLifetime = 0;

  if (activeCar.speedVariants) {
    const randomSpeed =
      activeCar.speedVariants[
        Math.floor(Math.random() * activeCar.speedVariants.length)
      ];
    car.classList.add(randomSpeed.className);
    finalLifetime = randomSpeed.lifetime;
  } else {
    car.classList.add(activeCar.speedClass);
    finalLifetime = activeCar.lifetime;
  }

  const siren = document.createElement("div");
  siren.classList.add("siren");
  car.appendChild(siren);

  road.appendChild(car);

  setTimeout(() => {
    if (car.parentNode) {
      car.remove();
    }
  }, finalLifetime);
}

function startTrafficSystem() {
  if (isAnimationsDisabled) return;

  const minTime = 400;
  const maxTime = 1500;
  const nextSpawnDelay =
    Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

  trafficTimeoutId = setTimeout(() => {
    spawnCar();
    startTrafficSystem();
  }, nextSpawnDelay);
}

/* ЗАПУСК ВСЕХ СИСТЕМ ПОСЛЕ ЗАГРУЗКИ СТРАНИЦЫ */
window.addEventListener("DOMContentLoaded", () => {
  checkInitialDevicePerformance();

  if (!isAnimationsDisabled) {
    startMemoryMonitor();
    startFpsMonitor();

    startTrafficSystem();
    for (let i = 0; i < 5; i++) {
      setTimeout(spawnCar, i * 400);
    }
  }
});

/* =========================================================
   3. ДИНАМИЧЕСКОЕ ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ КОНТЕНТА
   ========================================================= */
function switchPage(event, pageName) {
  event.preventDefault();

  const sections = document.querySelectorAll(".info-section");
  sections.forEach((section) => {
    section.style.display = "none";
  });

  const targetSection = document.getElementById("page-" + pageName);

  if (targetSection) {
    targetSection.style.display = "block";
    console.log(`[CITY UI] Успешный переход на вкладку: ${pageName}`);
  }
}

// Загрузка данных с сервера
async function loadServerData() {
  const gameBanner = document.getElementById("future-game-banner");
  const gameDateText = document.getElementById("game-date-text");
  const gameTimeText = document.getElementById("game-time-text");
  const newsEmptyMsg = document.getElementById("news-empty-msg");
  const newsMsgTitle = document.getElementById("news-msg-title");
  const newsMsgText = document.getElementById("news-msg-text");
  const newsContainer = document.getElementById("news-list-container");
  const cardTemplate = document.getElementById("news-card-template");
  try {
    const response = await fetch("/api/data", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
        "Bypass-Tunnel-Reminder": "true",
      },
    });
    const rawText = await response.text();
    if (rawText.trim().startsWith("<")) {
      throw new Error("Вернулся HTML: " + rawText.slice(0, 150));
    }
    const data = JSON.parse(rawText);
    if (data["future-game"] === true) {
      gameDateText.textContent = `📅 ${data["game-date"] || "Дата уточняется"}`;
      gameTimeText.textContent = `⏰ ${data["game-time"] || "Время уточняется"}`;
      gameBanner.style.display = "flex";
    } else {
      gameBanner.style.display = "none";
    }
    newsContainer.innerHTML = "";
    const newsList = data["news-list"];
    if (data.news === false) {
      newsMsgTitle.textContent = "Лента новостей отключена";
      newsMsgText.textContent =
        "Администрация временно скрыла публикацию новостей.";
      newsEmptyMsg.style.display = "block";
    } else if (!Array.isArray(newsList) || newsList.length === 0) {
      newsMsgTitle.textContent = "Новостей пока нет";
      newsMsgText.textContent =
        "Следите за обновлениями — скоро здесь появятся свежие события.";
      newsEmptyMsg.style.display = "block";
    } else {
      newsEmptyMsg.style.display = "none";
      newsList.forEach((item) => {
        const clone = cardTemplate.content.cloneNode(true);
        clone.querySelector(".tpl-title").textContent =
          item.title || "Новость города";
        clone.querySelector(".tpl-text").textContent = item.text || "";
        const dateEl = clone.querySelector(".tpl-date");
        if (item.date) {
          dateEl.textContent = `📅 ${item.date}`;
        } else {
          dateEl.style.display = "none";
        }
        const idEl = clone.querySelector(".tpl-id");
        if (item.id !== undefined) {
          idEl.textContent = `#${item.id}`;
        } else {
          idEl.style.display = "none";
        }
        newsContainer.appendChild(clone);
      });
    }
  } catch (error) {
    gameBanner.style.display = "none";
    newsContainer.innerHTML = "";
    newsMsgTitle.textContent = "Ошибка подключения";
    newsMsgText.textContent = error.message;
    newsEmptyMsg.style.display = "block";
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  await loadServerData();
});
