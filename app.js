const tabs = [...document.querySelectorAll(".case-tab")];
const panels = [...document.querySelectorAll("[data-case-panel]")];
const dialog = document.querySelector("#video-dialog");
const dialogVideo = document.querySelector("#dialog-video");
const dialogTitle = document.querySelector("#dialog-title");
const closeButton = document.querySelector("#dialog-close");
const soundButton = document.querySelector("#sound-toggle");
const progressBar = document.querySelector(".progress-line span");

let soundEnabled = false;
let audioContext;

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function playTone(frequency = 440, duration = 0.06, gainValue = 0.025) {
  if (!soundEnabled) return;

  audioContext ??= new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(gainValue, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + duration);
}

function selectCase(id) {
  tabs.forEach((tab) => {
    const selected = tab.dataset.case === id;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });

  panels.forEach((panel) => {
    const selected = panel.dataset.casePanel === id;
    panel.classList.toggle("is-hidden", !selected);
    if (selected) {
      panel.animate(
        [
          { opacity: 0, transform: "translateY(12px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 420, easing: "cubic-bezier(.22,1,.36,1)" },
      );
    }
  });

  playTone(360 + tabs.findIndex((tab) => tab.dataset.case === id) * 90);
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => selectCase(tab.dataset.case));
});

document.querySelectorAll(".play-button").forEach((button) => {
  button.addEventListener("click", () => {
    dialogTitle.textContent = button.dataset.videoTitle;
    dialogVideo.src = button.dataset.videoSrc;
    dialog.showModal();
    dialogVideo.play();
    playTone(520, 0.12, 0.04);
  });
});

function closeDialog() {
  dialogVideo.pause();
  dialogVideo.removeAttribute("src");
  dialogVideo.load();
  dialog.close();
  playTone(280);
}

closeButton.addEventListener("click", closeDialog);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDialog();
});

soundButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundButton.innerHTML = `<i data-lucide="${soundEnabled ? "volume-2" : "volume-x"}"></i>`;
  soundButton.setAttribute("aria-label", soundEnabled ? "关闭声效" : "开启声效");
  soundButton.setAttribute("title", soundEnabled ? "关闭声效" : "开启声效");
  refreshIcons();
  if (soundEnabled) playTone(620, 0.14, 0.035);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelectorAll(".case-visual").forEach((visual) => {
  const video = visual.querySelector(".preview-video");
  visual.addEventListener("mouseenter", () => video.play().catch(() => {}));
  visual.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });
});

window.addEventListener(
  "scroll",
  () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    progressBar.style.width = `${Math.min(progress * 100, 100)}%`;
  },
  { passive: true },
);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && dialog.open) closeDialog();
});

window.addEventListener("load", refreshIcons);
