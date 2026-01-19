



// ================= HERO SLIDER =================
document.addEventListener("DOMContentLoaded", () => {

  const heroSwiperEl = document.querySelector(".hero-swiper");
  const heroDots = document.querySelectorAll(".hero-wrapper .hero-dots span");
  const heroPrev = document.querySelector(".hero-arrow.left");
  const heroNext = document.querySelector(".hero-arrow.right");
  const bgImages = document.querySelectorAll(".overlay-bg .overlay-image");

  if (!heroSwiperEl || heroDots.length === 0) return;

  const heroSwiper = new Swiper(heroSwiperEl, {
    slidesPerView: 1,
    loop: true,
    speed: 800,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: false,
    navigation: false,

    on: {
      init(swiper) {
        updateHeroUI(swiper.realIndex);
      },
      slideChangeTransitionEnd(swiper) {
        updateHeroUI(swiper.realIndex);
      }
    }
  });

  function updateHeroUI(realIndex) {
    const index = realIndex % heroDots.length;

    /* ----- DOTS ----- */
    heroDots.forEach(dot => dot.classList.remove("active"));
    heroDots[index]?.classList.add("active");

    /* ----- BACKGROUND ----- */
    bgImages.forEach(bg => bg.classList.remove("active"));
    bgImages[index]?.classList.add("active");
  }

  /* Dot click */
  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      heroSwiper.slideToLoop(index);
      updateHeroUI(index);
    });
  });

  /* Arrows */
  heroPrev?.addEventListener("click", () => heroSwiper.slidePrev());
  heroNext?.addEventListener("click", () => heroSwiper.slideNext());

});



// ================= Logo SLIDER =================
const logoSwiper = new Swiper(".logo-swiper", {
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


// ================= MILESTONE COUNTER =================
document.addEventListener("DOMContentLoaded", () => {

  const counters = document.querySelectorAll(".milestone-stat-item h3");
  const milestoneSection = document.querySelector(".milestone-section");
  let started = false;

  if (!milestoneSection || counters.length === 0) return;

  function startCounter() {
    counters.forEach((counter, index) => {

      // check if this counter should show K
      const isKCounter = counter.querySelector("span");

      // numeric target only
      const target = parseInt(counter.dataset.target, 10);
      const speed = target > 1000 ? 200 : 100;

      let current = 0;

      const update = () => {
        const increment = Math.ceil(target / speed);

        if (current < target) {
          current += increment;

          if (current > target) current = target;

          counter.childNodes[0].nodeValue = current;
          setTimeout(update, 20);
        } else {
          counter.childNodes[0].nodeValue = target;
        }
      };

      update();
    });
  }

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      startCounter();
    }
  }, { threshold: 0.4 });

  observer.observe(milestoneSection);

});





// ================= TESTIMONIALS SLIDER =================

document.addEventListener("DOMContentLoaded", () => {

  const dotsWrapper = document.querySelector(".testimonials-section .hero-dots");
  const dots = dotsWrapper?.querySelectorAll("span") || [];

  let testimonialSwiper = null;
  let testimonialDesktopHTML = "";

  function setupTestimonialSwiper() {
    const wrapper = document.querySelector(".testimonials-swiper .swiper-wrapper");
    if (!wrapper) return;

    // destroy old
    if (testimonialSwiper) {
      testimonialSwiper.destroy(true, true);
      testimonialSwiper = null;
    }

    /* 📱 MOBILE → single testimonial-card swipe */
    if (window.innerWidth <= 768) {
      const cards = wrapper.querySelectorAll(".testimonials-section-item");
      wrapper.innerHTML = "";

      cards.forEach(card => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide testimonial-card-slide";
        slide.appendChild(card);
        wrapper.appendChild(slide);
      });

      testimonialSwiper = new Swiper(".testimonials-swiper", {
        slidesPerView: "auto",
        centeredSlides: false,
        spaceBetween: 16,
        speed: 600,
        loop: true,

        allowTouchMove: true,
        grabCursor: true,

        navigation: {
          nextEl: ".testimonials-icon .right",
          prevEl: ".testimonials-icon .left",
        },

        on: {
          slideChange(swiper) {
            updateTestimonialDots(swiper.realIndex);
          }
        }
      });
    }

    /* 🖥️ DESKTOP → full box swipe */
    else {
      wrapper.innerHTML = testimonialDesktopHTML;

      testimonialSwiper = new Swiper(".testimonials-swiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        speed: 1200,
        loop: true,

        navigation: {
          nextEl: ".testimonials-icon .right",
          prevEl: ".testimonials-icon .left",
        },

        on: {
          slideChange(swiper) {
            updateTestimonialDots(swiper.realIndex);
          }
        }
      });
    }
  }

  /* SAVE DESKTOP STRUCTURE ONCE */
  const wrapper = document.querySelector(".testimonials-swiper .swiper-wrapper");
  if (wrapper) testimonialDesktopHTML = wrapper.innerHTML;

  setupTestimonialSwiper();

  window.addEventListener("resize", () => {
    clearTimeout(window.testimonialResizeTimer);
    window.testimonialResizeTimer = setTimeout(setupTestimonialSwiper, 200);
  });

  /* ---------- DOTS ---------- */
  function updateTestimonialDots(realIndex) {
    if (!dots.length) return;

    const index = realIndex % dots.length;
    dots.forEach(dot => dot.classList.remove("active"));
    dots[index]?.classList.add("active");
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      if (!testimonialSwiper) return;
      testimonialSwiper.slideToLoop(index);
      updateTestimonialDots(index);
    });
  });

  updateTestimonialDots(0);

});




// Blog Section


document.addEventListener("DOMContentLoaded", () => {

  const heroDots = document.querySelectorAll(".blogs-section .hero-dots span");

  let blogSwiper = null;
  let blogDesktopHTML = "";

  function setupBlogSwiper() {
    const wrapper = document.querySelector(".blogs-section-wrapper .swiper-wrapper");
    if (!wrapper) return;

    // destroy old swiper
    if (blogSwiper) {
      blogSwiper.destroy(true, true);
      blogSwiper = null;
    }

    /* ==================================================
       📱 MOBILE (≤576px) → 1 blog-card per slide
       ================================================== */
    if (window.innerWidth <= 576) {

      const cards = [...wrapper.querySelectorAll(".blog-card")];
      wrapper.innerHTML = "";

      cards.forEach(card => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide blog-card-slide";
        slide.appendChild(card);
        wrapper.appendChild(slide);
      });

      blogSwiper = new Swiper(".blogs-section-wrapper", {
        slidesPerView: "auto",
        centeredSlides: false,
        spaceBetween: 16,
        speed: 600,
        loop: true,
        allowTouchMove: true,
        grabCursor: true,

        navigation: {
          nextEl: ".blogs-icon .right",
          prevEl: ".blogs-icon .left",
        },

        on: {
          slideChange(swiper) {
            updateBlogUI(swiper.realIndex);
          }
        }
      });

    }

    /* ==================================================
       📲 TABLET (577px – 992px) → 2 blog-cards per slide
       ================================================== */
    else if (window.innerWidth <= 992) {

      const cards = [...wrapper.querySelectorAll(".blog-card")];
      wrapper.innerHTML = "";

      for (let i = 0; i < cards.length; i += 2) {
        const slide = document.createElement("div");
        slide.className = "swiper-slide blog-pair-slide";

        slide.appendChild(cards[i]);
        if (cards[i + 1]) slide.appendChild(cards[i + 1]);

        wrapper.appendChild(slide);
      }

      blogSwiper = new Swiper(".blogs-section-wrapper", {
        slidesPerView: 1,
        spaceBetween: 24,
        speed: 700,
        loop: true,

        navigation: {
          nextEl: ".blogs-icon .right",
          prevEl: ".blogs-icon .left",
        },

        on: {
          slideChange(swiper) {
            updateBlogUI(swiper.realIndex);
          }
        }
      });

    }

    /* ==================================================
       🖥️ DESKTOP (>992px) → original columns
       ================================================== */
    else {

      wrapper.innerHTML = blogDesktopHTML;

      blogSwiper = new Swiper(".blogs-section-wrapper", {
        slidesPerView: 1,
        spaceBetween: 30,
        speed: 800,
        loop: true,
        watchOverflow: false,

        navigation: {
          nextEl: ".blogs-icon .right",
          prevEl: ".blogs-icon .left",
        },

        on: {
          slideChange(swiper) {
            updateBlogUI(swiper.realIndex);
          }
        }
      });
    }
  }

  /* SAVE DESKTOP HTML ONCE */
  const wrapper = document.querySelector(".blogs-section-wrapper .swiper-wrapper");
  if (wrapper) blogDesktopHTML = wrapper.innerHTML;

  setupBlogSwiper();

  window.addEventListener("resize", () => {
    clearTimeout(window.blogResizeTimer);
    window.blogResizeTimer = setTimeout(setupBlogSwiper, 200);
  });

  /* ---------- DOT UI ---------- */
  function updateBlogUI(realIndex) {
    if (!heroDots.length) return;
    const index = realIndex % heroDots.length;
    heroDots.forEach(dot => dot.classList.remove("active"));
    heroDots[index]?.classList.add("active");
  }

  /* ---------- DOT CLICK ---------- */
  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      if (!blogSwiper) return;
      blogSwiper.slideToLoop(index);
      updateBlogUI(index);
    });
  });

  updateBlogUI(0);
});


// services section 

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".services-tabs .tab");
  const boxes = document.querySelectorAll(".Services-box");

  boxes[0].classList.add("active");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.target;

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      boxes.forEach(box => {
        box.classList.remove("active");
        if (box.dataset.service === target) {
          box.classList.add("active");
        }
      });
    });
  });
});


// why choose us section mobile view slide 
const slider = document.querySelector('.about-grid .row');

let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('touchstart', e => {
  isDown = true;
  startX = e.touches[0].pageX;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener('touchmove', e => {
  if (!isDown) return;
  const x = e.touches[0].pageX;
  const walk = (startX - x);
  slider.scrollLeft = scrollLeft + walk;
});

slider.addEventListener('touchend', () => {
  isDown = false;
});

document.addEventListener("DOMContentLoaded", () => {
  const row = document.querySelector(".about-grid .row");
  const cards = row.querySelectorAll(
    ".why-choose-section-item:not(.why-choose-section-item1)"
  );

  const dotsWrap = document.querySelector(".why-choose-dots");
  const prevBtn = document.querySelector(".slide-btn.prev");
  const nextBtn = document.querySelector(".slide-btn.next");

  let index = 0;
  const gap = 16;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsWrap.appendChild(dot);
  });

  const dots = dotsWrap.querySelectorAll("span");

  function updateSlider() {
    const cardWidth = cards[0].offsetWidth + gap;
    row.scrollTo({
      left: cardWidth * index,
      behavior: "smooth",
    });

    dots.forEach(d => d.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
  }

  nextBtn.addEventListener("click", () => {
    if (index < cards.length - 1) index++;
    updateSlider();
  });

  prevBtn.addEventListener("click", () => {
    if (index > 0) index--;
    updateSlider();
  });

  row.addEventListener("scroll", () => {
    const cardWidth = cards[0].offsetWidth + gap;
    index = Math.round(row.scrollLeft / cardWidth);

    dots.forEach(d => d.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
  });
});


// Our Services Power Logistics Across Businesses - Read More buttons




