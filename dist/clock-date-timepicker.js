(function () {
  function ClockTimePicker(targetInputSelector) {
    // Remove old modal if exists
    const oldModal = document.getElementById("clockTimeModal");
    if (oldModal) oldModal.remove();

    const modalHTML = `
      <div class="modal fade time-picker-modal" id="clockTimeModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content text-center">
            <div class="time-header">
              <span class="time-part text-white" id="selectedHour">12</span>:
              <span class="time-part text-white" id="selectedMinute">00</span>
              <div class="ampm-toggle mt-2">
                <button class="btn" id="amBtn">AM</button>
                <button class="btn" id="pmBtn">PM</button>
              </div>
            </div>
            <div class="modal-body">
              <div class="clock-face" id="clockFace">
                <div class="clock-dot"></div>
                <div class="clock-hand" id="clockHand"></div>
              </div>
              <div class="d-flex justify-content-between px-3">
                <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button class="btn theme-btn" id="confirmClockBtn">OK</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const inputEl = document.querySelector(targetInputSelector);
    const hourEl = document.getElementById("selectedHour");
    const minuteEl = document.getElementById("selectedMinute");
    const clockFace = document.getElementById("clockFace");
    const clockHand = document.getElementById("clockHand");
    const amBtn = document.getElementById("amBtn");
    const pmBtn = document.getElementById("pmBtn");
    const confirmBtn = document.getElementById("confirmClockBtn");

    const themeAttr = inputEl.getAttribute('theme')?.toLowerCase();
    const validThemes = ['dark', 'orange', 'purple', 'green', 'red', 'yellow', 'primary'];
    const allThemes = ['theme-dark', 'theme-orange', 'theme-purple', 'theme-green', 'theme-red', 'theme-yellow'];
    document.body.classList.remove(...allThemes);
    if (validThemes.includes(themeAttr) && themeAttr !== 'primary') {
    document.body.classList.add(`theme-${themeAttr}`);
    }

    let picking = "hour";
    let selectedHour = 12;
    let selectedMinute = 0;
    let isPM = false;

    // Load time from input if already set
    function loadTimeFromInput() {
      const val = inputEl.value.trim();
      if (!val) return;

      const match = val.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
      if (match) {
        selectedHour = parseInt(match[1]);
        selectedMinute = parseInt(match[2]);
        isPM = match[3].toUpperCase() === "PM";
      }
    }

    function setAmPmButtons() {
      amBtn.classList.remove("btn-active");
      pmBtn.classList.remove("btn-active");
      (isPM ? pmBtn : amBtn).classList.add("btn-active");
    }

    function createClockNumbers(count, step = 1) {
      clockFace.querySelectorAll(".clock-number").forEach(n => n.remove());
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 360;
        const num = i * step;
        const label = num === 0 ? "00" : (num < 10 ? "0" + num : num);
        const el = document.createElement("div");
        el.className = "clock-number";
        el.style.top = `${50 - 40 * Math.cos(angle * Math.PI / 180)}%`;
        el.style.left = `${50 + 40 * Math.sin(angle * Math.PI / 180)}%`;
        el.textContent = picking === "hour" && num === 0 ? 12 : label;
        el.onclick = () => {
          if (picking === "hour") {
            selectedHour = num === 0 ? 12 : num;
            hourEl.textContent = selectedHour < 10 ? "0" + selectedHour : selectedHour;
            picking = "minute";
            drawClock();
          } else {
            selectedMinute = num;
            minuteEl.textContent = selectedMinute < 10 ? "0" + selectedMinute : selectedMinute;
            updateClockHand();
          }
        };
        clockFace.appendChild(el);
      }
    }

    function updateClockHand() {
      const value = picking === "hour" ? selectedHour % 12 : selectedMinute / 5;
      const angle = (value / 12) * 360;
      clockHand.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    }

    function drawClock() {
      createClockNumbers(12, picking === "hour" ? 1 : 5);
      updateClockHand();

      hourEl.classList.toggle("active", picking === "hour");
      minuteEl.classList.toggle("active", picking === "minute");
    }

    hourEl.onclick = () => {
      picking = "hour";
      drawClock();
    };

    minuteEl.onclick = () => {
      picking = "minute";
      drawClock();
    };

    amBtn.onclick = () => {
      isPM = false;
      setAmPmButtons();
    };

    pmBtn.onclick = () => {
      isPM = true;
      setAmPmButtons();
    };

    confirmBtn.onclick = () => {
      const hourStr = (selectedHour < 10 ? "0" : "") + selectedHour;
      const minStr = (selectedMinute < 10 ? "0" : "") + selectedMinute;
      const ampm = isPM ? "PM" : "AM";
      inputEl.value = `${hourStr}:${minStr} ${ampm}`;
      bootstrap.Modal.getInstance(document.getElementById("clockTimeModal")).hide();
    };

    // Initialize
    loadTimeFromInput();
    hourEl.textContent = selectedHour < 10 ? "0" + selectedHour : selectedHour;
    minuteEl.textContent = selectedMinute < 10 ? "0" + selectedMinute : selectedMinute;
    setAmPmButtons();
    drawClock();

    new bootstrap.Modal(document.getElementById("clockTimeModal")).show();
  }

  

  window.ClockTimePicker = ClockTimePicker;
})();
