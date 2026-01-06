
const items = document.querySelectorAll('.op-item');

items.forEach(item => {
  item.querySelector('.op-header').addEventListener('click', () => {
    items.forEach(i => {
      if (i !== item) i.classList.remove('active');
    });
    item.classList.toggle('active');
  });
});

//  scrolll Effect 
// const cards = document.querySelectorAll(".tech-card");

// const observer = new IntersectionObserver(
//   entries => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         entry.target.classList.add("active");
//       }
//     });
//   },
//   {
//     threshold: 0.35
//   }
// );

// cards.forEach(card => observer.observe(card));
gsap.registerPlugin(ScrollTrigger);

const cards = gsap.utils.toArray(".tech-stack .tech-card");

const CARD_HEIGHT = 300;
const GAP = 50;
const TAB = 28;

let currentMode = null; // "desktop" | "mobile"


function initDesktopStack() {
  currentMode = "desktop";

  ScrollTrigger.getAll().forEach(st => st.kill());
  gsap.killTweensOf(cards);

  cards.forEach(card => {
    gsap.set(card, { position: "relative", y: 0 });
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".tech-stack",
      start: "top top",
      end: () => `+=${cards.length * 100}%`,
      scrub: true,
      pin: true,
      pinSpacing: true
    }
  });

  tl.add(() => {
    cards.forEach((card, i) => {
      gsap.set(card, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        y: i * (CARD_HEIGHT + GAP),
        zIndex: cards.length - i
      });
    });
  });

  cards.forEach((card, i) => {
    tl.to(card, {
      y: i * TAB,
      zIndex: cards.length + i,
      ease: "none"
    });
  });
}


function initMobileStack() {
  currentMode = "mobile";

  ScrollTrigger.getAll().forEach(st => st.kill());
  gsap.killTweensOf(cards);

  cards.forEach(card => {
    gsap.set(card, {
      position: "relative",
      y: 0,
      clearProps: "transform"
    });
  });

  // const pinOffset = window.innerHeight * 0.6 + 100;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".tech-stack",
      start: "top+=100 top",
      end: () => `+=${cards.length * 100}%`,
      scrub: true,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1
    }
  });

  // stack cards
  tl.add(() => {
    cards.forEach((card, i) => {
      gsap.set(card, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        y: i * (CARD_HEIGHT + GAP),
        zIndex: cards.length - i
      });
    });
  });

  // compress stack
  cards.forEach((card, i) => {
    tl.to(card, {
      y: i * TAB,
      ease: "none"
    });
  });
}




function initTechStackByScreen() {
  const isMobile = window.innerWidth <= 900;

  if (isMobile && currentMode !== "mobile") {
    initMobileStack();
  }

  if (!isMobile && currentMode !== "desktop") {
    initDesktopStack();
  }
}

// Initial load
initTechStackByScreen();

// Resize handling
window.addEventListener("resize", () => {
  clearTimeout(window.__stackResize);
  window.__stackResize = setTimeout(initTechStackByScreen, 300);
});



// couting js for network and warehouse section 

document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(
    ".coverage-stats h4, .warehouse-card h4"
  );

  const speed = 60;

  const animateCounter = (counter) => {
    const text = counter.innerText.trim();
    const hasPlus = text.includes("+");
    const hasPercent = text.includes("%");

    let target = parseFloat(text.replace("+", "").replace("%", ""));
    let count = 0;

    const increment = target / speed;

    const updateCount = () => {
      count += increment;

      if (count < target) {
        counter.innerText =
          (hasPercent ? count.toFixed(1) : Math.floor(count)) +
          (hasPlus ? "+" : "") +
          (hasPercent ? "%" : "");
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = text; // exact final value
      }
    };

    updateCount();
  };

  // Trigger only once when section appears
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => observer.observe(counter));
});
