// ================= GLOBAL INIT =================

document.addEventListener("DOMContentLoaded", () => {
  Swiper.defaults.updateOnWindowResize = false;

  initHeroSlider();
  initLogoSlider();
  initCounter();
  initTestimonials();
  initBlogs();
  initServicesTabs();
  initWhyChoose();
});


// ================= HERO SLIDER =================

function initHeroSlider() {

  const heroSwiperEl = document.querySelector(".hero-swiper");
  if (!heroSwiperEl) return;

  const dots = [...document.querySelectorAll(".hero-wrapper .hero-dots span")];
  const bgImages = [...document.querySelectorAll(".overlay-bg .overlay-image")];

  const prevBtn = document.querySelector(".hero-arrow.left");
  const nextBtn = document.querySelector(".hero-arrow.right");

  if (!dots.length) return;

  const heroSwiper = new Swiper(heroSwiperEl, {
    slidesPerView: 1,
    loop: true,
    speed: 700,

    preloadImages: false,
    lazy: { loadPrevNext: true },

    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },

    observer: true,
    observeParents: true,

    on: {
      init: swiper => updateHeroUI(swiper.realIndex),
      slideChangeTransitionEnd: swiper => updateHeroUI(swiper.realIndex)
    }
  });

  function updateHeroUI(realIndex) {

    const index = realIndex % dots.length;

    dots.forEach(d => d.classList.remove("active"));
    bgImages.forEach(bg => bg.classList.remove("active"));

    dots[index]?.classList.add("active");
    bgImages[index]?.classList.add("active");
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => heroSwiper.slideToLoop(i));
  });

  prevBtn?.addEventListener("click", () => heroSwiper.slidePrev());
  nextBtn?.addEventListener("click", () => heroSwiper.slideNext());

}


// ================= LOGO AUTO SLIDER =================

function initLogoSlider() {

  if (!document.querySelector(".logo-swiper")) return;

  new Swiper(".logo-swiper", {
    slidesPerView: "auto",
    spaceBetween: 40,
    loop: true,
    speed: 6000,
    allowTouchMove: false,

    autoplay: {
      delay: 0,
      disableOnInteraction: false
    },

    freeMode: true,
    freeModeMomentum: false
  });

}


// ================= COUNTER =================

function initCounter() {

  const counters = document.querySelectorAll(".milestone-stat-item h3");
  const section = document.querySelector(".milestone-section");

  if (!section || counters.length === 0) return;

  let started = false;

  function animateCounter(counter) {

    const target = Number(counter.dataset.target);
    const suffix = counter.querySelector("span")?.innerText || "";

    const speed = target > 1000 ? 200 : 100;
    let current = 0;

    function update() {

      const increment = Math.ceil(target / speed);
      current += increment;

      if (current >= target) {

        // FINAL VALUE SET
        if (suffix === "K") {
          counter.childNodes[0].nodeValue = Math.floor(target / 1000);
        } else {
          counter.childNodes[0].nodeValue = target;
        }

        return;
      }

      // RUNNING VALUE SET
      if (suffix === "K") {
        counter.childNodes[0].nodeValue = Math.floor(current / 1000);
      } else {
        counter.childNodes[0].nodeValue = current;
      }

      requestAnimationFrame(update);
    }

    update();
  }

  const observer = new IntersectionObserver((entries) => {

    if (entries[0].isIntersecting && !started) {

      started = true;

      counters.forEach(counter => {
        animateCounter(counter);
      });

    }

  }, { threshold: 0.4 });

  observer.observe(section);

}


// ================= TESTIMONIALS =================

function initTestimonials() {

  const swiperEl = document.querySelector(".testimonials-swiper");
  if (!swiperEl) return;

  const wrapper = swiperEl.querySelector(".swiper-wrapper");
  const dots = document.querySelectorAll(".testimonials-section .hero-dots span");

  let swiper = null;
  let desktopHTML = wrapper.innerHTML;

  function setup() {

    if (swiper) {
      swiper.destroy(true, true);
      swiper = null;
    }

    const isMobile = window.innerWidth <= 768;

    wrapper.innerHTML = isMobile ? "" : desktopHTML;

    if (isMobile) {

      const cards = desktopHTML;
      wrapper.innerHTML = cards;

      const items = wrapper.querySelectorAll(".testimonials-section-item");

      wrapper.innerHTML = "";

      items.forEach(card => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";
        slide.appendChild(card);
        wrapper.appendChild(slide);
      });

    }

    swiper = new Swiper(".testimonials-swiper", {
      slidesPerView: isMobile ? "auto" : 1,
      spaceBetween: isMobile ? 16 : 30,
      speed: isMobile ? 600 : 1200,
      loop: true,

      navigation: {
        nextEl: ".testimonials-icon .right",
        prevEl: ".testimonials-icon .left"
      },

      on: {
        slideChange: s => updateDots(s.realIndex)
      }
    });

  }

  function updateDots(index) {

    const active = index % dots.length;

    dots.forEach(d => d.classList.remove("active"));
    dots[active]?.classList.add("active");

  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => swiper.slideToLoop(i));
  });

  setup();
  window.addEventListener("resize", debounce(setup, 200));

}


// ================= BLOGS =================

function initBlogs() {

  const swiperEl = document.querySelector(".blogs-section-wrapper");
  if (!swiperEl) return;

  const wrapper = swiperEl.querySelector(".swiper-wrapper");
  const dots = document.querySelectorAll(".blogs-section .hero-dots span");

  let swiper = null;
  const desktopHTML = wrapper.innerHTML;

  function setup() {

    if (swiper) {
      swiper.destroy(true, true);
      swiper = null;
    }

    wrapper.innerHTML = "";

    const width = window.innerWidth;

    const cards = [...document
      .createRange()
      .createContextualFragment(desktopHTML)
      .querySelectorAll(".blog-card")];

    // ================= MOBILE =================
    if (width <= 576) {

      cards.forEach(card => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";
        slide.appendChild(card);
        wrapper.appendChild(slide);
      });

    }

    // ================= TABLET =================
    else if (width <= 992) {

      for (let i = 0; i < cards.length; i += 2) {

        const slide = document.createElement("div");
        slide.className = "swiper-slide";

        slide.appendChild(cards[i]);
        cards[i + 1] && slide.appendChild(cards[i + 1]);

        wrapper.appendChild(slide);
      }

    }

    // ================= DESKTOP =================
    else {

      wrapper.innerHTML = desktopHTML;

    }

    swiper = new Swiper(".blogs-section-wrapper", {
      slidesPerView: "auto", // REQUIRED
      spaceBetween: 16,
      speed: 700,
      loop: true,

      loopedSlides: cards.length,
      loopAdditionalSlides: 3,

      observer: true,
      observeParents: true,

      navigation: {
        nextEl: ".blogs-icon .right",
        prevEl: ".blogs-icon .left"
      },

      on: {
        slideChange(swiper) {
          updateDots(swiper.realIndex);
        }
      }
    });


  }

  function updateDots(index) {

    if (!dots.length) return;

    const active = index % dots.length;

    dots.forEach(d => d.classList.remove("active"));
    dots[active]?.classList.add("active");

  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => swiper.slideToLoop(i));
  });

  setup();
  window.addEventListener("resize", debounce(setup, 250));

}


// ================= SERVICES TABS =================

function initServicesTabs() {

  const tabs = document.querySelectorAll(".services-tabs .tab");
  const boxes = document.querySelectorAll(".Services-box");

  if (!tabs.length || !boxes.length) return;

  boxes[0].classList.add("active");

  tabs.forEach(tab => {

    tab.addEventListener("click", () => {

      const target = tab.dataset.target;

      tabs.forEach(t => t.classList.remove("active"));
      boxes.forEach(b => b.classList.remove("active"));

      tab.classList.add("active");
      document.querySelector(`[data-service="${target}"]`)?.classList.add("active");

    });

  });

}


// ================= WHY CHOOSE SLIDER =================

function initWhyChoose() {

  const row = document.querySelector(".about-grid .row");
  if (!row) return;

  const cards = row.querySelectorAll(".why-choose-section-item");
  const dotsWrap = document.querySelector(".why-choose-dots");

  let index = 0;
  const GAP = 16;

  let cardWidth = cards[0].offsetWidth + GAP;

  function update() {

    row.style.transform = `translateX(${-index * cardWidth}px)`;

    [...dotsWrap.children].forEach(d => d.classList.remove("active"));
    dotsWrap.children[index]?.classList.add("active");

  }

  dotsWrap.innerHTML = "";

  cards.forEach((_, i) => {

    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");

    dot.onclick = () => {
      index = i;
      update();
    };

    dotsWrap.appendChild(dot);
  });

  window.addEventListener("resize", () => {
    cardWidth = cards[0].offsetWidth + GAP;
    update();
  });

}


// ================= UTILITY =================

function debounce(fn, delay) {

  let timer;

  return function () {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };

}
