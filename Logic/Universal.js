// Universal JS

// Lazy Loading
document.querySelectorAll("img").forEach(img => {
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
            body: formData
        })
            .then(response => response.json())
            .then(data => {

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
            .catch(error => {
                alert("❌ Something went wrong. Please try again.");
                console.error(error);
            });

    });

}


