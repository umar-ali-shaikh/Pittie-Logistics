const logos = document.querySelectorAll(".logo");
const thumb = document.getElementById("videoThumbnail");
const playBtn = document.getElementById("playVideo");
const modal = document.getElementById("videoModal");
const iframe = document.getElementById("videoFrame");
const closeBtn = document.querySelector(".close");

let currentIndex = 0;
let intervalTime = 8000;
let autoSlide;

// ---- ACTIVATE LOGO ----
function activateLogo(index) {
  logos.forEach(l => l.classList.remove("active"));

  logos[index].classList.add("active");
  thumb.src = logos[index].dataset.thumb;
  currentIndex = index;
}

// ---- AUTO SLIDE ----
function startAutoSlide() {
  autoSlide = setInterval(() => {
    currentIndex = (currentIndex + 1) % logos.length;
    activateLogo(currentIndex);
  }, intervalTime);
}

// ---- RESET AUTO ON CLICK ----
function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

// ---- LOGO CLICK ----
logos.forEach((logo, index) => {
  logo.addEventListener("click", () => {
    activateLogo(index);
    resetAutoSlide();
  });
});

// ---- PLAY VIDEO ----
playBtn.addEventListener("click", () => {
  const videoURL = logos[currentIndex].dataset.video;
  iframe.src = videoURL + "?autoplay=1";
  modal.classList.add("active");
});

// ---- CLOSE MODAL ----
function closeModal() {
  modal.classList.remove("active");
  iframe.src = "";
}

closeBtn.addEventListener("click", closeModal);

modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

// ---- INIT ----
activateLogo(0);
startAutoSlide();


// image carousal 


  const track = document.getElementById("brandTrack");
  let speed = 0.5; // control speed here
  let position = 0;

  // Duplicate logos dynamically (NO hardcoding)
  track.innerHTML += track.innerHTML;

  function animate() {
    position -= speed;

    // when first set completely moves out
    if (Math.abs(position) >= track.scrollWidth / 2) {
      position = 0;
    }

    track.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(animate);
  }

  animate();

  // Our partners value for mobile view 
document.addEventListener("DOMContentLoaded", function () {

  const logos = document.querySelectorAll(".client-logos .logo");
  const thumbnail = document.getElementById("videoThumbnail");

  let currentIndex = 0;
  let interval;

  function activateLogo(index) {
    const logo = logos[index];
    if (!logo) return;

    const thumb = logo.dataset.thumb;

    // 🔥 SAME FRAME UPDATE
    requestAnimationFrame(() => {
      logos.forEach(l => l.classList.remove("active"));
      logo.classList.add("active");
      thumbnail.src = thumb;
    });
  }

  function startAuto() {
    interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % logos.length;
      activateLogo(currentIndex);
    }, 4000);
  }

  // initial
  activateLogo(currentIndex);
  startAuto();

  // manual click
  logos.forEach((logo, index) => {
    logo.addEventListener("click", () => {
      clearInterval(interval);
      currentIndex = index;
      activateLogo(index);
      startAuto();
    });
  });

});



// see more btn


const seeMoreBtn = document.getElementById("seeMoreBtn");
const hiddenCards = document.querySelectorAll(".product-card.hidden");

let expanded = false;

seeMoreBtn.addEventListener("click", function () {
    expanded = !expanded;

    hiddenCards.forEach(card => {
        card.style.display = expanded ? "flex" : "none";
    });

    seeMoreBtn.textContent = expanded ? "See less" : "See more";
});




