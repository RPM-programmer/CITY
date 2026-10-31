/* 1. УПРАВЛЕНИЕ ВЫПАДАЮЩИМ МЕНЮ "СЕРВИСЫ" */
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

/* 2. СИСТЕМА ДВИЖЕНИЯ 12 ГОРОДСКИХ МАШИН */
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
    car.remove();
  }, finalLifetime);
}

function startTrafficSystem() {
  const minTime = 400;
  const maxTime = 1500;
  const nextSpawnDelay =
    Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

  setTimeout(() => {
    spawnCar();
    startTrafficSystem();
  }, nextSpawnDelay);
}

/* ЗАПУСК ТРАФИКА ДЛЯ ХОСТА */
window.addEventListener("DOMContentLoaded", () => {
  startTrafficSystem();
  for (let i = 0; i < 5; i++) {
    setTimeout(spawnCar, i * 400);
  }
});
/* 3. ДИНАМИЧЕСКОЕ ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ КОНТЕНТА */
function switchPage(event, pageName) {
  // Отменяем стандартный переход по ссылке-якорю
  event.preventDefault();

  // Находим все текстовые секции на странице
  const sections = document.querySelectorAll(".info-section");

  // Прячем абсолютно все разделы
  sections.forEach((section) => {
    section.style.display = "none";
  });

  // Находим именно тот раздел, на который кликнул пользователь
  const targetSection = document.getElementById("page-" + pageName);

  if (targetSection) {
    // Делаем выбранный раздел видимым
    targetSection.style.display = "block";

    // Выводим информацию в консоль для проверки работы системы
    console.log(`[CITY UI] Успешный переход на вкладку: ${pageName}`);
  }
}
