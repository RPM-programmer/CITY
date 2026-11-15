document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".card-form");

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      // 1. Отменяем стандартную перезагрузку страницы
      event.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const statusBox = form.querySelector(".form-status");
      const originalBtnText = submitBtn.value || submitBtn.textContent;

      // 2. Собираем все поля формы в объект { name: value }
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // 3. Блокируем кнопку на время отправки
      submitBtn.disabled = true;
      submitBtn.value = "Отправка...";
      if (statusBox) {
        statusBox.textContent = "";
        statusBox.className = "form-status";
      }

      try {
        // 4. Отправляем запрос на адрес из атрибута action (/game/set или /news/create)
        const response = await fetch(form.action, {
          method: form.method || "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }

        // 5. Успешная отправка
        form.reset();
        if (statusBox) {
          statusBox.textContent = "Успешно сохранено!";
          statusBox.classList.add("success");
        }
      } catch (error) {
        // 6. Обработка ошибки
        console.error("Ошибка отправки:", error);
        if (statusBox) {
          statusBox.textContent =
            "Не удалось отправить данные. Попробуйте ещё раз.";
          statusBox.classList.add("error");
        }
      } finally {
        // 7. Возвращаем кнопку в исходное состояние
        submitBtn.disabled = false;
        submitBtn.value = originalBtnText;
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const elements = [
    document.getElementById("menu"),
    document.getElementById("delete"),
    document.getElementById("off"),
    document.getElementById("delete-status"),
    document.getElementById("off-status"),
  ];
  elements[1].addEventListener("click", async () => {
    const result = await fetch("/game/delete", { method: "GET" });
    if (result !== 200) {
      elements[3].textContent = "Успешно сохранено!";
      elements[3].classList.add("success");
    } else {
      elements[3].textContent =
        "Не удалось отправить данные. Попробуйте ещё раз.";
      elements[3].classList.add("error");
    }
    setTimeout(function () {
      elements[3].classList.remove("error");
      elements[3].classList.remove("success");
      elements[3].textContent = "";
    }, 1500);
  });
  elements[2].addEventListener("click", async () => {
    const result = await fetch("/game/off", { method: "GET" });
    if (result !== 200) {
      elements[4].textContent = "Успешно сохранено!";
      elements[4].classList.add("success");
    } else {
      elements[4].textContent =
        "Не удалось отправить данные. Попробуйте ещё раз.";
      elements[4].classList.add("error");
    }
    setTimeout(function () {
      elements[4].classList.remove("error");
      elements[4].classList.remove("success");
      elements[4].textContent = "";
    }, 1500);
  });
});
