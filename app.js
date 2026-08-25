const soundButton = document.querySelector("#sound-toggle");
const progressBar = document.querySelector(".page-progress span");

let soundEnabled = false;
let audioContext;

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function playTone(frequency = 420, duration = 0.07) {
  if (!soundEnabled) return;

  audioContext ??= new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.025, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + duration);
}

soundButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundButton.innerHTML = `<i data-lucide="${soundEnabled ? "volume-2" : "volume-x"}"></i>`;
  soundButton.setAttribute("aria-label", soundEnabled ? "关闭界面声效" : "开启界面声效");
  soundButton.setAttribute("title", soundEnabled ? "关闭界面声效" : "开启界面声效");
  refreshIcons();
  if (soundEnabled) playTone(620, 0.14);
});

document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", () => playTone(360));
});

document.querySelectorAll(".case-media").forEach((container) => {
  const video = container.querySelector("video");
  if (!video) return;

  container.addEventListener("mouseenter", () => {
    video.currentTime = 0;
    video.muted = true;
    video.play().catch(() => {});
  });

  container.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });

  container.addEventListener("click", (event) => {
    if (event.target === video) return;
    video.muted = false;
    video.play().catch(() => {});
    playTone(520, 0.1);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

window.addEventListener(
  "scroll",
  () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    progressBar.style.width = `${Math.min(progress * 100, 100)}%`;
  },
  { passive: true },
);

window.addEventListener("load", refreshIcons);
