// ---------- JAM DIGITAL DAN SAPAAN ----------
    const clock = document.getElementById("clock");
    const dateText = document.getElementById("date");
    const greeting = document.getElementById("greeting");

    function updateClock() {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString("id-ID", {
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
      });
      dateText.textContent = now.toLocaleDateString("id-ID", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
      });

      const hour = now.getHours();
      let message = "Good Evening";
      if (hour >= 4 && hour < 11) message = "Good Morning";
      else if (hour >= 11 && hour < 15) message = "Good Afternoon";
      else if (hour >= 15 && hour < 18) message = "Good Evening";

      const savedName = localStorage.getItem("dashboardName") || "";
      greeting.textContent = savedName ? `${message}, ${savedName}!` : `${message}!`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    //ubah nama sapaan
    document.getElementById("saveName").addEventListener("click", () => {
      const name = document.getElementById("nameInput").value.trim();
      localStorage.setItem("dashboardName", name);
      updateClock();
    });

    //light/dark mode
    const themeButton = document.getElementById("themeButton");
    function updateThemeButton() {
      themeButton.textContent = document.body.classList.contains("dark")
        ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
    if (localStorage.getItem("dashboardTheme") === "dark") {
      document.body.classList.add("dark");
    }
    updateThemeButton();

    themeButton.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("dashboardTheme",
        document.body.classList.contains("dark") ? "dark" : "light");
      updateThemeButton();
    });

    //focus timer/pomodoro
    const timerDisplay = document.getElementById("timerDisplay");
    const focusMinutes = document.getElementById("focusMinutes");
    let duration = 25 * 60;
    let remaining = duration;
    let timerInterval = null;

    function showTimer() {
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
    }

    document.getElementById("startTimer").addEventListener("click", () => {
      if (timerInterval !== null) return;
      if (remaining <= 0) remaining = duration;
      timerInterval = setInterval(() => {
        remaining--;
        showTimer();
        if (remaining <= 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          alert("Waktu fokus selesai! Saatnya beristirahat.");
        }
      }, 1000);
    });

    document.getElementById("stopTimer").addEventListener("click", () => {
      clearInterval(timerInterval);
      timerInterval = null;
    });

    document.getElementById("resetTimer").addEventListener("click", () => {
      clearInterval(timerInterval);
      timerInterval = null;
      remaining = duration;
      showTimer();
    });

    document.getElementById("setDuration").addEventListener("click", () => {
      const minutes = Number(focusMinutes.value);
      if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
        alert("Masukkan durasi antara 1 sampai 180 menit.");
        return;
      }
      clearInterval(timerInterval);
      timerInterval = null;
      duration = minutes * 60;
      remaining = duration;
      showTimer();
    });
    showTimer();

    // ---------- TASK LIST ----------
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    let tasks = JSON.parse(localStorage.getItem("dashboardTasks") || "[]");

    function saveTasks() {
      localStorage.setItem("dashboardTasks", JSON.stringify(tasks));
    }

    function renderTasks() {
      taskList.innerHTML = "";
      if (tasks.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty";
        empty.textContent = "Belum ada tugas. Tambahkan tugas pertamamu!";
        taskList.appendChild(empty);
        return;
      }

      tasks.forEach((task, index) => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.setAttribute("aria-label", "Tandai tugas selesai");
        checkbox.addEventListener("change", () => {
          tasks[index].done = checkbox.checked;
          saveTasks();
          renderTasks();
        });

        const span = document.createElement("span");
        span.className = task.done ? "task-text done" : "task-text";
        span.textContent = task.text;

        const editButton = document.createElement("button");
        editButton.className = "secondary";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
          const updatedText = prompt("Edit tugas:", task.text);
          if (updatedText === null) return; // Pengguna membatalkan edit
          if (!updatedText.trim()) {
            alert("Nama tugas tidak boleh kosong.");
            return;
          }
          tasks[index].text = updatedText.trim();
          saveTasks();
          renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "danger";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
          tasks.splice(index, 1);
          saveTasks();
          renderTasks();
        });

        li.append(checkbox, span, editButton, deleteButton);
        taskList.appendChild(li);
      });
    }

    taskForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = taskInput.value.trim();
      if (!text) return;
      tasks.push({ text: text, done: false });
      saveTasks();
      renderTasks();
      taskInput.value = "";
      taskInput.focus();
    });
    renderTasks();

    //quick links
    const linkForm = document.getElementById("linkForm");
    const linkName = document.getElementById("linkName");
    const linkUrl = document.getElementById("linkUrl");
    const quickLinks = document.getElementById("quickLinks");

    const defaultLinks = [
      { name: "Google", url: "https://www.google.com" },
      { name: "Gmail", url: "https://mail.google.com" },
      { name: "Calendar", url: "https://calendar.google.com" }
    ];
    let links = JSON.parse(localStorage.getItem("dashboardLinks") || "null") || defaultLinks;

    function saveLinks() {
      localStorage.setItem("dashboardLinks", JSON.stringify(links));
    }

    function renderLinks() {
      quickLinks.innerHTML = "";
      links.forEach((link, index) => {
        const wrapper = document.createElement("div");
        const anchor = document.createElement("a");
        anchor.className = "quick-link";
        anchor.href = link.url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.textContent = link.name;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "×";
        remove.setAttribute("aria-label", "Hapus " + link.name);
        remove.addEventListener("click", (event) => {
          event.preventDefault();
          links.splice(index, 1);
          saveLinks();
          renderLinks();
        });

        anchor.appendChild(remove);
        wrapper.appendChild(anchor);
        quickLinks.appendChild(wrapper);
      });
    }

    linkForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = linkName.value.trim();
      let url = linkUrl.value.trim();
      if (!name || !url) return;
      if (!/^https?:\/\//i.test(url)) url = "https://" + url;
      try {
        const parsedUrl = new URL(url);
        if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error();
      } catch {
        alert("URL tidak valid. Contoh: https://www.google.com");
        return;
      }
      links.push({ name: name, url: url });
      saveLinks();
      renderLinks();
      linkForm.reset();
    });
    renderLinks();
