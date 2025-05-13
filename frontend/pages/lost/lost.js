document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        let valid = true;
        const inputs = form.querySelectorAll("input[required], textarea[required], select[required]");

        inputs.forEach(input => {
            if (!input.value.trim()) {
                valid = false;
                input.style.border = "2px solid red";
            } else {
                input.style.border = "1px solid #ccc";
            }
        });

        if (!valid) {
            alert("Please fill in all required fields.");
            return;
        }

        // Prepare form data for submission
        const formData = new FormData(form);

        // Convert formData to JSON object
        const jsonObject = {};
        formData.forEach((value, key) => {
            jsonObject[key] = value;
        });

        try {
            const response = await fetch('/api/lost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonObject)
            });

            if (response.ok) {
                alert("You will be notified.");
                window.location.href = "../catalogues/catlog.html";
            } else {
                const errorData = await response.json();
                alert("Error submitting form: " + (errorData.message || "Unknown error"));
            }
        } catch (error) {
            alert("Error submitting form: " + error.message);
        }
    });

    form.querySelectorAll("input, textarea, select").forEach(input => {
        input.addEventListener("input", function () {
            if (this.value.trim()) {
                this.style.border = "1px solid #ccc";
            }
        });
    });
});
