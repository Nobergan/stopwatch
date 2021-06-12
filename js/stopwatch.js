const refs = {
  startBtn: document.querySelector("button[data-action-start]"),
  stopBtn: document.querySelector("button[data-action-stop]"),
  waitBtn: document.querySelector("button[data-action-wait]"),
  resumeBtn: document.querySelector("button[data-action-resume]"),
  resetBtn: document.querySelector("button[data-action-reset]"),
  clockface: document.querySelector(".js-clockface"),
};

const timer = {
  intervalId: null,
  isActive: false,
  timerNow: "",

  start() {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    const startTime = Date.now();

    updateClockface(0);

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = currentTime - startTime;

      updateClockface(deltaTime);
      this.timerNow = deltaTime;
    }, 1000);
  },

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isActive = false;
    updateClockface(0);
  },

  wait() {
    refs.resumeBtn.classList.remove("not-show");
    refs.waitBtn.classList.add("not-show");
    clearInterval(this.intervalId);
  },

  resume() {
    refs.resumeBtn.classList.add("not-show");
    refs.waitBtn.classList.remove("not-show");

    if (this.timerNow) {
      this.intervalId = setInterval(() => {
        updateClockface((this.timerNow += 1000));
      }, 1000);
    }
  },

  reset() {
    if (this.isActive) {
      clearInterval(this.intervalId);

      const startTime = Date.now();
      refs.resumeBtn.classList.add("not-show");
      refs.waitBtn.classList.remove("not-show");

      this.intervalId = setInterval(() => {
        const currentTime = Date.now();
        const deltaTime = currentTime - startTime;
        updateClockface(deltaTime);
      }, 0);
    }
  },
};

refs.startBtn.addEventListener("click", timer.start.bind(timer));
refs.stopBtn.addEventListener("click", timer.stop.bind(timer));
refs.waitBtn.addEventListener("dblclick", timer.wait.bind(timer));
refs.resumeBtn.addEventListener("dblclick", timer.resume.bind(timer));
refs.resetBtn.addEventListener("click", timer.reset.bind(timer));

function updateClockface(time) {
  const hours = pad(
    Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  );
  const mins = pad(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
  const secs = pad(Math.floor((time % (1000 * 60)) / 1000));

  refs.clockface.textContent = `${hours}:${mins}:${secs}`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}
