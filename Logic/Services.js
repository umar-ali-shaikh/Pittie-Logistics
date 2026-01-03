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
    }, 5000); // change time here
  }

  startAutoSlide();


  // function toggleOverlay() {
  //   document.getElementById("overlayImage").classList.toggle("active");
  //   document.getElementById("overlayImage1").classList.toggle("active");
  // }

function toggleOverlay(event) {
  event.stopPropagation();

  const overlay0 = document.getElementById("overlayImage");   // 01.png
  const overlay1 = document.getElementById("overlayImage1");  // 02.png

  const isHotspot0 = event.currentTarget.classList.contains("hotspot");
  const isHotspot1 = event.currentTarget.classList.contains("hotspot1");

  /* =========================
     HOTSPOT (01)
     ========================= */
  if (isHotspot0) {
    // Case: both active → only turn off second
    if (overlay0.classList.contains("active") && overlay1.classList.contains("active")) {
      overlay1.classList.remove("active");
      return;
    }

    // Normal toggle for first
    overlay0.classList.toggle("active");

    // If first turns off → second must also be off
    if (!overlay0.classList.contains("active")) {
      overlay1.classList.remove("active");
    }
  }

  /* =========================
     HOTSPOT1 (02)
     ========================= */
  if (isHotspot1) {
    // If second already active → turn everything off
    if (overlay1.classList.contains("active")) {
      overlay1.classList.remove("active");
      overlay0.classList.remove("active");
    } 
    // Otherwise → activate chain
    else {
      overlay0.classList.add("active");
      overlay1.classList.add("active");
    }
  }
}

