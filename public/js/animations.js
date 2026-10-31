/* ======================================================= */
/*   СЦЕНАРИИ КРИТИЧЕСКИХ СИТУАЦИЙ CITY RP                 */
/* ======================================================= */
let isEasterEggRunning = false;

// Универсальная система смерти с кнопкой перезагрузки
function checkPermadeathChance(
  reasonText,
  showBackgroundSirens = false,
  forceDeath = false,
) {
  if (forceDeath || Math.random() < 0.3) {
    console.log(
      "[CITY RP] КРИТИЧЕСКАЯ СИТУАЦИЯ: Игрок погиб от: " + reasonText,
    );

    if (showBackgroundSirens) {
      const deathSiren = document.createElement("div");
      deathSiren.className = "death-siren-overlay";
      document.body.appendChild(deathSiren);
    }

    const deathScreen = document.createElement("div");
    deathScreen.className = "permadeath-screen";

    const title = document.createElement("div");
    title.className = "permadeath-title";
    title.textContent = "ВЫ УМЕРЛИ";

    const reason = document.createElement("div");
    reason.className = "permadeath-reason";
    reason.textContent = "от " + reasonText;

    const respawnBtn = document.createElement("button");
    respawnBtn.className = "respawn-btn";
    respawnBtn.textContent = "Возродиться";

    respawnBtn.onclick = function () {
      window.location.reload();
    };

    deathScreen.appendChild(title);
    deathScreen.appendChild(reason);
    deathScreen.appendChild(respawnBtn);
    document.body.appendChild(deathScreen);

    return true;
  }
  return false;
}

/* ======================================================= */
/*   ПАСХАЛКА №1: АРЕСТ С ШОКЕРОМ И МОНЕТАМИ               */
/* ======================================================= */
function triggerEasterEgg(isDevCall = false) {
  if (isEasterEggRunning) return;
  isEasterEggRunning = true;
  console.log("[CITY RP] Погоня: Рассыпаны улики (монеты), полиция на хвосте!");

  const activeContainer =
    document.getElementById("coin-container") || document.body;

  let coinCount = 90;
  let interval = setInterval(() => {
    if (coinCount <= 0) {
      clearInterval(interval);
      startPoliceChaseSiren(isDevCall);
      return;
    }
    const coin = document.createElement("div");
    coin.className = "easter-coin";
    coin.style.left = Math.random() * 100 + "vw";
    coin.style.animationDuration = Math.random() * 2 + 2 + "s";
    activeContainer.appendChild(coin);
    coinCount--;
    setTimeout(() => {
      coin.remove();
    }, 4000);
  }, 40);
}

function startPoliceChaseSiren(isDevCall) {
  const sirenOverlay = document.createElement("div");
  sirenOverlay.className = "screamer-siren";
  document.body.appendChild(sirenOverlay);

  setTimeout(() => {
    sirenOverlay.remove();
    startTazerShotFlash(isDevCall);
  }, 3000);
}

function startTazerShotFlash(isDevCall) {
  const flashOverlay = document.createElement("div");
  flashOverlay.className = "white-flash";
  document.body.appendChild(flashOverlay);

  setTimeout(() => {
    flashOverlay.classList.add("active");
  }, 10);

  setTimeout(() => {
    flashOverlay.remove();
    startTazerBlackout(isDevCall);
  }, 200);
}

function startTazerBlackout(isDevCall) {
  const tazerBlackout = document.createElement("div");
  tazerBlackout.className = "blackout-overlay";
  document.body.appendChild(tazerBlackout);

  setTimeout(() => {
    tazerBlackout.classList.add("active");
  }, 10);

  setTimeout(() => {
    tazerBlackout.remove();
    if (
      checkPermadeathChance(
        "остановки сердца при аресте шокером",
        true,
        isDevCall,
      )
    )
      return;
    isEasterEggRunning = false;
  }, 2500);
}

/* ======================================================= */
/*       ПАСХАЛКА №2: ОБМОРОК И РЕАНИМАЦИЯ СКОРОЙ          */
/* ======================================================= */
function triggerFaintingEffect() {
  if (isEasterEggRunning) return;
  isEasterEggRunning = true;
  const blackout = document.createElement("div");
  blackout.className = "blackout-overlay";
  document.body.appendChild(blackout);
  setTimeout(() => {
    blackout.classList.add("active");
  }, 50);
  setTimeout(() => {
    blackout.remove();
    const flash = document.createElement("div");
    flash.className = "white-flash";
    document.body.appendChild(flash);
    flash.classList.add("active");
    setTimeout(() => {
      flash.remove();
      const blueGlow = document.createElement("div");
      blueGlow.className = "blue-neon-glow";
      document.body.appendChild(blueGlow);
      setTimeout(() => {
        blueGlow.style.transition = "opacity 2s ease-out";
        blueGlow.style.opacity = "0";
        setTimeout(() => {
          blueGlow.remove();
          isEasterEggRunning = false;
        }, 2000);
      }, 5000);
    }, 200);
  }, 5500);
}

/* ======================================================= */
/*       ПАСХАЛКА №3: ВЗРЫВ ГАЗА С ВЫЗОВОМ СЛУЖБ           */
/* ======================================================= */
function triggerGasExplosion(isDevCall = false) {
  if (isEasterEggRunning) return;
  isEasterEggRunning = true;
  console.log("[CITY RP] ЧП: Взрыв бытового газа!");

  // 1. Экран резко наклоняется (эффект взрывной волны)
  document.body.classList.add("screen-flip");

  // 2. Создаем и показываем огненную вспышку взрыва
  const explosion = document.createElement("div");
  explosion.className = "gas-explosion-overlay";
  document.body.appendChild(explosion);

  setTimeout(() => {
    explosion.classList.add("boom");
  }, 10);

  // 3. Сознание гаснет через 400мс (взрывная волна прошла, ослепило, падаем в обморок)
  setTimeout(() => {
    document.body.classList.remove("screen-flip");
    explosion.remove(); // Убираем огонь взрыва

    // Включаем полную темноту (обморок)
    const blackout = document.createElement("div");
    blackout.className = "blackout-overlay";
    document.body.appendChild(blackout);
    blackout.classList.add("active");

    // 4. Пока игрок лежит в темноте 3.5 секунды, на фоне начинают выть сирены и приезжают службы
    setTimeout(() => {
      blackout.remove(); // Игрок открывает глаза

      // Запускаем сцену эвакуации (приезд скорой, пожарной, милиции)
      triggerServicesArrivalScene(isDevCall);
    }, 3500);
  }, 400);
}

// Сцена приезда экстренных служб после взрыва
function triggerServicesArrivalScene(isDevCall) {
  const road = document.getElementById("road");
  if (!road) return;

  // Полноэкранные красно-синие отблески мигалок
  const chaosSiren = document.createElement("div");
  chaosSiren.className = "screamer-siren";
  document.body.appendChild(chaosSiren);

  // Создаем машины служб
  const pCar = document.createElement("div");
  const mCar = document.createElement("div");
  const fCar = document.createElement("div");
  pCar.className = "traffic-car car-police speed-fast";
  mCar.className = "traffic-car car-medical speed-fast";
  fCar.className = "traffic-car car-fire speed-fast";
  pCar.style.bottom = "-4px";
  mCar.style.bottom = "2px";
  fCar.style.bottom = "8px";

  road.appendChild(pCar);
  road.appendChild(mCar);
  road.appendChild(fCar);

  // Машины тормозят на середине дороги
  setTimeout(() => {
    pCar.classList.add("accident-stop");
    pCar.style.left = "35%";
    mCar.classList.add("accident-stop");
    mCar.style.left = "45%";
    fCar.classList.add("accident-stop");
    fCar.style.left = "55%";

    // Игрока грузят в машину. Спустя 4 секунды все исчезает
    setTimeout(() => {
      pCar.remove();
      mCar.remove();
      fCar.remove();
      chaosSiren.remove();

      // И ВОТ ТЕПЕРЬ, когда сцена завершена, рассчитывается шанс смерти (или 100% при тесте)
      if (checkPermadeathChance("взрыва газа", false, isDevCall)) return;

      isEasterEggRunning = false;
      console.log(
        "[CITY RP] Игрок успешно эвакуирован, здоровье стабилизировано.",
      );
    }, 4000);
  }, 1300);
}

/* ======================================================= */
/*       ЛОГИКА ПАСХАЛКИ №4: ПОЖАР И СПАСЕНИЕ              */
/* ======================================================= */
function triggerCarFire(isDevCall = false) {
  if (isEasterEggRunning) return;
  isEasterEggRunning = true;
  console.log("[CITY RP] Масштабное возгорание в секторе!");

  const fireGlow = document.createElement("div");
  fireGlow.className = "screen-fire-glow";
  document.body.appendChild(fireGlow);

  const smokeOverlay = document.createElement("div");
  smokeOverlay.className = "screen-smoke-overlay";
  document.body.appendChild(smokeOverlay);

  setTimeout(() => {
    document.body.classList.add("crawling-screen");

    setTimeout(() => {
      const road = document.getElementById("road");
      if (road) {
        const fireEngine = document.createElement("div");
        const ambulance = document.createElement("div");
        fireEngine.className = "traffic-car car-fire speed-fast";
        ambulance.className = "traffic-car car-medical speed-fast";
        fireEngine.style.bottom = "-2px";
        ambulance.style.bottom = "6px";

        road.appendChild(fireEngine);
        road.appendChild(ambulance);

        setTimeout(() => {
          fireEngine.classList.add("accident-stop");
          fireEngine.style.left = "42%";
          ambulance.classList.add("accident-stop");
          ambulance.style.left = "52%";

          setTimeout(() => {
            fireGlow.remove();
            smokeOverlay.remove();
            document.body.classList.remove("crawling-screen");
            fireEngine.remove();
            ambulance.remove();

            if (
              checkPermadeathChance(
                "серьезных ожогов при пожаре",
                false,
                isDevCall,
              )
            )
              return;

            isEasterEggRunning = false;
          }, 5000);
        }, 1300);
      }
    }, 2500);
  }, 2500);
}

function triggerAccident() {
  if (isEasterEggRunning) return;
  triggerGasExplosion(false);
}

/* АВТОНОМНЫЙ УМНЫЙ ТАЙМЕР ПАСХАЛОК */
function independentEasterEggTimer() {
  setTimeout(() => {
    if (isEasterEggRunning) {
      independentEasterEggTimer();
      return;
    }
    let rolledChance = Math.random();
    if (rolledChance < 0.005) {
      triggerEasterEgg(false);
    } else if (rolledChance >= 0.005 && rolledChance < 0.01) {
      triggerFaintingEffect();
    } else if (rolledChance >= 0.01 && rolledChance < 0.018) {
      triggerCarFire(false);
    } else if (rolledChance >= 0.018 && rolledChance < 0.025) {
      triggerGasExplosion(false);
    }
    independentEasterEggTimer();
  }, 40000);
}
window.addEventListener("DOMContentLoaded", () => {
  independentEasterEggTimer();
});
/* ХОТКЕИ ДЛЯ ТЕСТОВ */
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && !e.shiftKey && e.code === "Space") {
    e.preventDefault();
    triggerEasterEgg(true);
  }
  if (e.ctrlKey && e.shiftKey && e.code === "Space") {
    e.preventDefault();
    triggerFaintingEffect();
  }
  if (e.ctrlKey && e.code === "Digit2") {
    e.preventDefault();
    triggerCarFire(true);
  }
  if (e.ctrlKey && e.code === "Digit3") {
    e.preventDefault();
    triggerGasExplosion(true);
  }
});
