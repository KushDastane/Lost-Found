document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const checkbox = document.getElementById("confirm_return");
        if (!checkbox.checked) {
            alert("You must confirm that you will return the item to the Lost & Found Desk.");
            return;
        }

        // Collect form data
        const formData = new FormData(form);

        try {
            const response = await fetch('/api/found/found', {  // Updated URL here
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                alert("Item submitted successfully.");
                window.location.href = '/catalogues'; // Redirect to catalog after successful submission
            } else {
                alert(data.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
            console.error("Error submitting form:", error);
        }
    });
});
