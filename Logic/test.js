
gsap.registerPlugin(ScrollTrigger);

const cards = gsap.utils.toArray(".tech-stack .tech-card");

const CARD_HEIGHT = 300;
const GAP = 50;
const TAB = 28;

/* INITIAL NORMAL STATE */
cards.forEach(card => {
  gsap.set(card, { position: "relative", y: 0 });
});

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".tech-stack",
    start: "top top",
    end: () => `+=${cards.length * 100}%`, // 👈 each card gets scroll space
    scrub: true,
    pin: true,
    pinSpacing: true
  }
});

/* ACTIVATE ABSOLUTE STACK AT START */
tl.add(() => {
  cards.forEach((card, i) => {
    gsap.set(card, {
      position: "absolute",
      top: 0,
      left: 0,
      y: i * (CARD_HEIGHT + GAP),
      zIndex: cards.length - i
    });
  });
});

/* 🔥 ONE BY ONE STACK */
cards.forEach((card, i) => {
  tl.to(card, {
    y: i * TAB,              // 28px step
    zIndex: cards.length + i,
    ease: "none"
  });
});