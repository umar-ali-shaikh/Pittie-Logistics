// ================= GLOBAL INIT =================

document.addEventListener("DOMContentLoaded", () => {
  Swiper.defaults.updateOnWindowResize = false;

  initHeroSlider();
  initLogoSlider();
  initCounter();
  initTestimonials();
  initBlogs();
  initServicesTabs();
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
      pauseOnMouseEnter: true,
    },

    observer: true,
    observeParents: true,

    on: {
      init: (swiper) => updateHeroUI(swiper.realIndex),
      slideChangeTransitionEnd: (swiper) => updateHeroUI(swiper.realIndex),
    },
  });

  function updateHeroUI(realIndex) {
    const index = realIndex % dots.length;

    dots.forEach((d) => d.classList.remove("active"));
    bgImages.forEach((bg) => bg.classList.remove("active"));

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
      disableOnInteraction: false,
    },

    freeMode: true,
    freeModeMomentum: false,
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

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;

        counters.forEach((counter) => {
          animateCounter(counter);
        });
      }
    },
    { threshold: 0.4 },
  );

  observer.observe(section);
}

// ================= TESTIMONIALS =================

function initTestimonials() {
  const swiperEl = document.querySelector(".testimonials-swiper");
  if (!swiperEl) return;

  const wrapper = swiperEl.querySelector(".swiper-wrapper");
  const dots = document.querySelectorAll(
    ".testimonials-section .hero-dots span",
  );

  // Overlay Elements
  const overlays = document.querySelectorAll(
    ".testimonials-section-overlay > div",
  );

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
      wrapper.innerHTML = desktopHTML;

      const items = wrapper.querySelectorAll(".testimonials-section-item");

      wrapper.innerHTML = "";

      items.forEach((card) => {
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

      // ✅ MOBILE ONLY TOUCH SLIDE
      allowTouchMove: isMobile,
      simulateTouch: isMobile,

      // Prevent click blocking
      touchStartPreventDefault: false,
      preventClicks: false,
      preventClicksPropagation: false,

      // Desktop arrows only
      navigation: isMobile
        ? false
        : {
            nextEl: ".testimonials-icon .right",
            prevEl: ".testimonials-icon .left",
          },

      on: {
        slideChange: (s) => {
          updateDots(s.realIndex);
          updateOverlay(s.realIndex);
        },
      },
    });

    // Initial overlay state
    updateOverlay(0);
  }

  function updateDots(index) {
    const active = index % dots.length;

    dots.forEach((d) => d.classList.remove("active"));
    dots[active]?.classList.add("active");
  }

  function updateOverlay(index) {
    const active = index % overlays.length;

    overlays.forEach((o) => o.classList.remove("active"));
    overlays[active]?.classList.add("active");
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => swiper.slideToLoop(i));
  });

  setup();
  window.addEventListener("resize", debounce(setup, 200));
}

// INIT
initTestimonials();

document.addEventListener("click", function (e) {
  const text = e.target.closest(".ellipsis-text");

  if (!text) return;

  e.preventDefault();
  e.stopPropagation();

  text.classList.toggle("expanded");
});

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

    const cards = [
      ...document
        .createRange()
        .createContextualFragment(desktopHTML)
        .querySelectorAll(".blog-card"),
    ];

    // ================= MOBILE (1 per slide) =================
    if (width <= 576) {
      cards.forEach((card) => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide blogs-section-column";
        slide.appendChild(card);
        wrapper.appendChild(slide);
      });
    }

    // ================= TABLET (2 per slide) =================
    else if (width <= 992) {
      for (let i = 0; i < cards.length; i += 2) {
        const slide = document.createElement("div");
        slide.className = "swiper-slide blogs-section-column";

        slide.appendChild(cards[i]);
        if (cards[i + 1]) slide.appendChild(cards[i + 1]);

        wrapper.appendChild(slide);
      }
    }

    // ================= DESKTOP (3 per slide) =================
    else {
      for (let i = 0; i < cards.length; i += 3) {
        const slide = document.createElement("div");
        slide.className = "swiper-slide blogs-section-column";

        slide.appendChild(cards[i]);
        if (cards[i + 1]) slide.appendChild(cards[i + 1]);
        if (cards[i + 2]) slide.appendChild(cards[i + 2]);

        wrapper.appendChild(slide);
      }
    }

    swiper = new Swiper(".blogs-section-wrapper", {
      slidesPerView: 1, // IMPORTANT
      spaceBetween: 20,
      speed: 600,
      loop: false, // VERY IMPORTANT (fixes random repeat)

      navigation: {
        nextEl: ".blogs-icon .right",
        prevEl: ".blogs-icon .left",
      },

      on: {
        slideChange(swiper) {
          updateDots(swiper.activeIndex);
        },
      },
    });
  }

  function updateDots(index) {
    if (!dots.length) return;

    dots.forEach((d) => d.classList.remove("active"));
    dots[index]?.classList.add("active");
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => swiper.slideTo(i));
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

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.target;

      tabs.forEach((t) => t.classList.remove("active"));
      boxes.forEach((b) => b.classList.remove("active"));

      tab.classList.add("active");
      document
        .querySelector(`[data-service="${target}"]`)
        ?.classList.add("active");
    });
  });
}

// ================= WHY CHOOSE SLIDER =================
function initWhyChooseMobileSlider() {
  const row = document.querySelector(".about-grid .row");
  const dotsWrap = document.querySelector(".why-choose-dots");
  const prevBtn = document.querySelector(".why-choose-controls .prev");
  const nextBtn = document.querySelector(".why-choose-controls .next");

  if (!row || !dotsWrap) return;

  const cards = row.querySelectorAll(".why-choose-section-item");

  let index = 0;
  const GAP = 16;
  let cardWidth = 0;

  function isMobile() {
    return window.innerWidth <= 576;
  }

  function calcWidth() {
    cardWidth = cards[0].offsetWidth + GAP;
  }

  function updateSlider() {
    if (!isMobile()) {
      row.style.transform = "translateX(0)";
      dotsWrap.style.display = "none";
      return;
    }

    dotsWrap.style.display = "flex";

    row.style.transform = `translateX(${-index * cardWidth}px)`;

    [...dotsWrap.children].forEach((d) => d.classList.remove("active"));
    dotsWrap.children[index]?.classList.add("active");
  }

  function createDots() {
    dotsWrap.innerHTML = "";

    cards.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("active");

      dot.addEventListener("click", () => {
        index = i;
        updateSlider();
      });

      dotsWrap.appendChild(dot);
    });
  }

  // Buttons

  nextBtn?.addEventListener("click", () => {
    if (index < cards.length - 1) {
      index++;
      updateSlider();
    }
  });

  prevBtn?.addEventListener("click", () => {
    if (index > 0) {
      index--;
      updateSlider();
    }
  });

  // Swipe Support

  let startX = 0;

  row.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  row.addEventListener("touchend", (e) => {
    if (!isMobile()) return;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50 && index < cards.length - 1) index++;
    if (diff < -50 && index > 0) index--;

    updateSlider();
  });

  // INIT

  createDots();
  calcWidth();
  updateSlider();

  window.addEventListener("resize", () => {
    index = 0;
    calcWidth();
    updateSlider();
  });
}

// INIT CALL
initWhyChooseMobileSlider();

// ================= UTILITY =================

function debounce(fn, delay) {
  let timer;

  return function () {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}
