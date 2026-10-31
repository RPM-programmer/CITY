function toggleAuth() {
  document.getElementById("loginBox").classList.toggle("hidden");
  document.getElementById("registerBox").classList.toggle("hidden");
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch("/med/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Bypass-Tunnel-Reminder": "true",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.success) {
      if (result.user.role === "admin")
        window.location.href = "/med/html/dashboard-admin.html";
      else if (result.user.role === "doctor")
        window.location.href = "/med/html/dashboard-doctor.html";
      else window.location.href = "/med/html/dashboard-patient.html";
    } else {
      alert("Ошибка: " + result.message);
    }
  } catch (err) {
    alert("Не удалось связаться с сервером");
  }
});

document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const fullName = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    try {
      const response = await fetch("/med/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true",
        },
        body: JSON.stringify({ email, password, fullName }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Регистрация прошла успешно! Теперь вы можете войти.");
        toggleAuth();
      } else {
        alert("Ошибка регистрации: " + result.message);
      }
    } catch (err) {
      alert("Ошибка сети");
    }
  });
