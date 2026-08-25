// Lazy-load videos: set src when near viewport
const lazyVideos = document.querySelectorAll("video[data-src]");

const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const video = entry.target;
      video.src = video.dataset.src;
      video.preload = "metadata";
      videoObserver.unobserve(video);
    });
  },
  { rootMargin: "200px" },
);

lazyVideos.forEach((video) => videoObserver.observe(video));

// Hover autoplay for project videos
document.querySelectorAll(".proj-media").forEach((container) => {
  const video = container.querySelector("video");
  if (!video) return;

  container.addEventListener("mouseenter", () => {
    if (!video.src) video.src = video.dataset.src;
    video.currentTime = 0;
    video.muted = true;
    video.play().catch(() => {});
  });

  container.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });
});
