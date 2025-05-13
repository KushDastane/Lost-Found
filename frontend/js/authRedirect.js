// frontend/js/authRedirect.js
window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
        alert("You must be logged in to access this page.");
        window.location.href = "/frontend/pages/login/Login.html"; // adjust if needed
    }
});
