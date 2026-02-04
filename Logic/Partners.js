const logos = document.querySelectorAll(".logo");
const thumb = document.getElementById("videoThumbnail");
const thumbText = document.getElementById("thumbText");
const videoThumb = document.querySelector(".video-thumb");

let currentIndex = 0;
let intervalTime = 8000;
let timer;
let isPaused = false;


// ================= ACTIVATE LOGO =================

function activateLogo(index) {

  logos.forEach((logo) => {
    logo.classList.remove("active");
  });

  const activeLogo = logos[index];

  // Update image
  thumb.src = activeLogo.dataset.thumb;

  // Update text
  thumbText.innerText = activeLogo.dataset.text;

  // Add active class
  activeLogo.classList.add("active");

  currentIndex = index;
}


// ================= AUTO SLIDER =================

function startSlider() {

  timer = setInterval(() => {

    if (isPaused) return;

    currentIndex = (currentIndex + 1) % logos.length;
    activateLogo(currentIndex);

  }, intervalTime);

}


// ================= STOP SLIDER =================

function stopSlider() {
  clearInterval(timer);
}


// ================= LOGO CLICK =================

logos.forEach((logo, index) => {

  logo.addEventListener("click", () => {

    stopSlider();
    activateLogo(index);
    startSlider();

  });

});


// ================= HOVER PAUSE =================

videoThumb.addEventListener("mouseenter", () => {
  isPaused = true;
});

videoThumb.addEventListener("mouseleave", () => {
  isPaused = false;
});


// ================= INIT =================

activateLogo(0);
startSlider();



// see more btn

const seeMoreBtn = document.getElementById("seeMoreBtn");
const hiddenCards = document.querySelectorAll(".product-card.hidden");

let expanded = false;

seeMoreBtn.addEventListener("click", function () {
  expanded = !expanded;

  hiddenCards.forEach((card) => {
    card.style.display = expanded ? "flex" : "none";
  });

  seeMoreBtn.textContent = expanded ? "See less" : "See more";
});
