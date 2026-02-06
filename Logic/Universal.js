// Universal JS

// Lazy Loading
document.querySelectorAll("img").forEach((img) => {
  img.setAttribute("loading", "lazy");
});

// form successfull popup
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault(); // 🚫 browser redirect band

    const formData = new FormData(contactForm);

    fetch(contactForm.action, {
      method: contactForm.method || "POST",
      body: formData,
    })
      .then(res => res.text())
      .then(text => {
        try {
          const data = JSON.parse(text);

          if (data.success) {
            alert("✅ " + data.message);
            contactForm.reset();
          } else {
            alert("❌ " + data.message);
          }

        } catch (err) {
          console.error("Invalid JSON from PHP:", text);
          alert("❌ Server error. Please try again.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("❌ Network error.");
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

// Form modal get a quote form
const openBtns = document.querySelectorAll(".openQuoteForm");
const modal = document.getElementById("quoteModal");
const closeBtn = document.getElementById("closeQuoteForm");

openBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.style.display = "flex";
  });
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});



