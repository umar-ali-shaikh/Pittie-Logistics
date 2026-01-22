document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".team-toggle-btn");
  const grid = document.querySelector(".team-grid");

  btn.addEventListener("click", () => {
    grid.classList.toggle("expanded");
    btn.textContent = grid.classList.contains("expanded")
      ? "See Less"
      : "See More";
  });
});


document.querySelectorAll(".team-card").forEach(card => {
  const info = card.querySelector(".team-info");

  // Desktop hover out → reset scroll
  card.addEventListener("mouseleave", () => {
    info.scrollTop = 0;
  });
});


document.querySelectorAll(".team-card").forEach(card => {
  const info = card.querySelector(".team-info");

  // Tap outside / touch end → reset scroll
  card.addEventListener("touchend", () => {
    setTimeout(() => {
      info.scrollTop = 0;
    }, 200);
  });
});




// resume file
document.getElementById("resumeInput").addEventListener("change", function () {

  if (this.files.length > 0) {

    document.getElementById("fileName").textContent =
      "Selected File: " + this.files[0].name;

  } else {

    document.getElementById("fileName").textContent = "";

  }

});