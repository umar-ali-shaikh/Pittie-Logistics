const navItems = document.querySelectorAll(".services-nav li");
const contents = document.querySelectorAll(".service-content");

let currentIndex = 0;
let interval;

function showContent(index) {
  navItems.forEach((item) => item.classList.remove("active"));
  contents.forEach((content) => content.classList.remove("active"));

  navItems[index].classList.add("active");
  contents[index].classList.add("active");

  currentIndex = index;
}

navItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    clearInterval(interval);
    showContent(index);
    startAutoSlide();
  });
});

function startAutoSlide() {
  interval = setInterval(() => {
    let nextIndex = (currentIndex + 1) % contents.length;
    showContent(nextIndex);
  }, 5000);
}

startAutoSlide();

// URL redirect handling (without breaking existing logic)

const params = new URLSearchParams(window.location.search);
const serviceIndex = params.get("service");

if (serviceIndex !== null && contents[serviceIndex]) {
  clearInterval(interval);

  // Open correct service
  showContent(Number(serviceIndex));

  // Smooth scroll AFTER page render
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.querySelector("#services-content").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
  });

  // Restart slider
  startAutoSlide();
}

// Collaboration section overlays and hotspots
document.addEventListener("DOMContentLoaded", () => {
  const overlays = [
    "overlayImage",
    "overlayImage1",
    "overlayImage2",
    "overlayImage3",
    "overlayImage4",
    "overlayImage5",
    "overlayImage6",
    "overlayImage7",
    "overlayImage8",
    "overlayImage9",
    "overlayImage10",
    "overlayImage11",
  ].map((id) => document.getElementById(id));

  const hotspots = [
    ".hotspot",
    ".hotspot1",
    ".hotspot2",
    ".hotspot3",
    ".hotspot4",
    ".hotspot5",
    ".hotspot6",
    ".hotspot7",
    ".hotspot8",
    ".hotspot9",
    ".hotspot10",
    ".hotspot11",
  ].map((cls) => document.querySelector(cls));

  let currentStep = -1;
  let interval;

  function activateChain(index) {
    overlays.forEach((img, i) => {
      img.classList.toggle("active", i <= index);
    });
    currentStep = index;
  }

  function toggleOverlay(event) {
    event.stopPropagation();

    const index = hotspots.findIndex((h) => h === event.currentTarget);
    if (index === -1) return;

    // if clicked same active → reset
    if (currentStep === index) {
      overlays.forEach((img) => img.classList.remove("active"));
      currentStep = -1;
      return;
    }

    activateChain(index);
  }

  // attach clicks
  hotspots.forEach((h) => {
    h.addEventListener("click", toggleOverlay);
  });

  // 🔥 AUTO CHAIN EVERY 10 SECONDS
  function startAuto() {
    interval = setInterval(() => {
      currentStep++;
      if (currentStep >= overlays.length) {
        overlays.forEach((img) => img.classList.remove("active"));
        currentStep = -1;
      } else {
        activateChain(currentStep);
      }
    }, 2000);
  }

  startAuto();
});

//
