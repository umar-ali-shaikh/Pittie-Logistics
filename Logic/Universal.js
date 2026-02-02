// Universal JS

// Lazy Loading
document.querySelectorAll("img").forEach((img) => {
  img.setAttribute("loading", "lazy");
});

// form successfull popup
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Stop normal reload

    let form = this;
    let formData = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // ✅ SUCCESS POPUP
          alert("✅ " + data.message);

          // Clear form after success
          form.reset();
        } else {
          // ❌ ERROR POPUP
          alert("❌ " + data.message);
        }
      })
      .catch((error) => {
        alert("❌ Something went wrong. Please try again.");
        console.error(error);
      });
  });
}

// Footer links

document.addEventListener("DOMContentLoaded", function () {
  const hash = window.location.hash;

  if (hash === "#services-content") {
    const index = new URLSearchParams(window.location.search).get("service");

    if (index !== null) {
      // remove active from all nav items
      document
        .querySelectorAll(".services-nav li")
        .forEach((li) => li.classList.remove("active"));
      document
        .querySelectorAll(".service-content")
        .forEach((sc) => sc.classList.remove("active"));

      // add active to clicked one
      document
        .querySelector(`.services-nav li[data-index="${index}"]`)
        ?.classList.add("active");
      document
        .querySelectorAll(".service-content")
        [index]?.classList.add("active");
    }
  }
});
