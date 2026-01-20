// Universal JS

// Lazy Loading
document.querySelectorAll("img").forEach(img => {
    img.setAttribute("loading", "lazy");
});


// scroll smoothness

// gsap.registerPlugin(ScrollTrigger);

// /* ---------------- Lenis Setup ---------------- */
// const lenis = new Lenis({
//     smooth: true,
//     duration: 1.15,
//     easing: (t) => 1 - Math.pow(1 - t, 3),
//     wheelMultiplier: 0,
//     touchMultiplier: 0,
// });

// /* Sync Lenis with GSAP */
// lenis.on("scroll", ScrollTrigger.update);

// gsap.ticker.add((time) => {
//     lenis.raf(time * 1000);
// });
// gsap.ticker.lagSmoothing(0);

// /* ---------------- Section Snap Logic ---------------- */
// const sections = gsap.utils.toArray(".snap-section");
// let currentIndex = 0;
// let isAnimating = false;
// const ANIM_DURATION = 1.15; // seconds

// function scrollToSection(index) {
//     if (index < 0 || index >= sections.length || isAnimating) return;

//     isAnimating = true;
//     currentIndex = index;

//     lenis.scrollTo(sections[index], {
//         duration: ANIM_DURATION,
//         easing: (t) => 1 - Math.pow(1 - t, 3),
//         lock: true, // 🔥 VERY IMPORTANT
//     });

//     gsap.delayedCall(ANIM_DURATION, () => {
//         isAnimating = false;
//     });
// }

// /* ---------------- Wheel Control (NO SHAKE) ---------------- */
// window.addEventListener(
//     "wheel",
//     (e) => {
//         e.preventDefault(); // ⛔ stop native scroll

//         if (isAnimating) return;

//         if (e.deltaY > 0) {
//             scrollToSection(currentIndex + 1);
//         } else if (e.deltaY < 0) {
//             scrollToSection(currentIndex - 1);
//         }
//     },
//     { passive: false } // 🔥 MUST BE FALSE
// );


// if (window.innerWidth >= 992) {
//     gsap.registerPlugin(ScrollTrigger);

//     /* ================= Lenis Setup ================= */
//     const lenis = new Lenis({
//         smooth: true,
//         duration: 1.15,
//         easing: (t) => 1 - Math.pow(1 - t, 3),
//         wheelMultiplier: 1,
//         touchMultiplier: 1,
//     });

//     lenis.on("scroll", ScrollTrigger.update);

//     gsap.ticker.add((time) => {
//         lenis.raf(time * 1000);
//     });
//     gsap.ticker.lagSmoothing(0);

//     /* ================= Sections ================= */
//     const sections = gsap.utils.toArray(".snap-section");
//     let currentIndex = 0;
//     let isAnimating = false;

//     const ANIM_DURATION = 1.15;
//     const SCROLL_THRESHOLD = 40;

//     /* ================= Helpers ================= */

//     // check if next section touches viewport (100vh rule)
//     function isNextSectionTouching(section, index) {
//         const rect = section.getBoundingClientRect();
//         const nextSection = sections[index + 1];
//         if (!nextSection) return false;

//         // current section ka bottom viewport ko touch kare
//         return rect.bottom <= window.innerHeight + 2;
//     }

//     /* ================= Snap Scroll ================= */
//     function scrollToSection(index) {
//         if (index < 0 || index >= sections.length || isAnimating) return;

//         isAnimating = true;
//         currentIndex = index;

//         lenis.scrollTo(sections[index], {
//             duration: ANIM_DURATION,
//             easing: (t) => 1 - Math.pow(1 - t, 3),
//             lock: true,
//         });

//         gsap.delayedCall(ANIM_DURATION, () => {
//             isAnimating = false;
//         });
//     }

//     /* ================= Wheel Control ================= */
//     window.addEventListener(
//         "wheel",
//         (e) => {
//             if (Math.abs(e.deltaY) < SCROLL_THRESHOLD) return;

//             const currentSection = sections[currentIndex];
//             let shouldSnap = false;

//             if (e.deltaY > 0) {
//                 // ⬇ scroll down
//                 shouldSnap = isNextSectionTouching(currentSection, currentIndex);
//             } else {
//                 // ⬆ scroll up
//                 const rect = currentSection.getBoundingClientRect();
//                 shouldSnap = rect.top >= -2;
//             }

//             if (!shouldSnap || isAnimating) return;

//             e.preventDefault();

//             if (e.deltaY > 0) {
//                 scrollToSection(currentIndex + 1);
//             } else {
//                 scrollToSection(currentIndex - 1);
//             }
//         },
//         { passive: false }
//     );

//     /* ================= Sync Active Index ================= */
//     sections.forEach((section, i) => {
//         ScrollTrigger.create({
//             trigger: section,
//             start: "top center",
//             onEnter: () => (currentIndex = i),
//             onEnterBack: () => (currentIndex = i),
//         });
//     });

// }





// h2 animation
function splitTextIntoChars(el) {
    const nodes = Array.from(el.childNodes);

    nodes.forEach(node => {

        // ✅ TEXT NODE → split karo
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (!text.trim()) return;

            const fragment = document.createDocumentFragment();
            const words = text.split(" ");

            words.forEach((word, wordIndex) => {
                const wordSpan = document.createElement("span");
                wordSpan.classList.add("word");

                [...word].forEach(char => {
                    const charSpan = document.createElement("span");
                    charSpan.classList.add("char");
                    charSpan.textContent = char;
                    wordSpan.appendChild(charSpan);
                });

                fragment.appendChild(wordSpan);

                if (wordIndex < words.length - 1) {
                    fragment.appendChild(document.createTextNode(" "));
                }
            });

            node.replaceWith(fragment);
        }

        // ✅ ELEMENT NODE → recurse (span ke andar bhi kaam kare)
        else if (node.nodeType === Node.ELEMENT_NODE) {
            // 👉 br ko chhedna nahi
            if (node.tagName !== "BR") {
                splitTextIntoChars(node);
            }
        }
    });
}




document.querySelectorAll(".reveal-chars").forEach(splitTextIntoChars);

/* -------- Intersection Observer (ONE TIME) -------- */
const charObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const chars = entry.target.querySelectorAll(".char");

            gsap.fromTo(
                chars,
                {
                    y: 70,
                    opacity: 0,
                    filter: "blur(8px)",
                    rotateX: 12
                },
                {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    rotateX: 0,
                    duration: 1.2,
                    ease: "power4.out",   // 👈 luxury easing
                    stagger: 0.03         // 👈 buttery rhythm
                }
            );

            observer.unobserve(entry.target); // ONE TIME ONLY
        });
    },
    { threshold: 1 }
);

document.querySelectorAll(".reveal-chars").forEach(el => {
    charObserver.observe(el);
});
