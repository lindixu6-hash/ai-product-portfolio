// Hover autoplay for all videos
document.querySelectorAll(".cover-media, .proj-media").forEach((container) => {
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
});
