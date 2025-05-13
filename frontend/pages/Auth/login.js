document.addEventListener("DOMContentLoaded", () => {
    const studentBtn = document.getElementById("student-btn");
    const teacherBtn = document.getElementById("teacher-btn");
    const loginBtn = document.getElementById("login-btn");

    // Initially set active role
    let activeRole = 'student';

    studentBtn.addEventListener("click", () => {
        studentBtn.classList.add("active");
        teacherBtn.classList.remove("active");
        loginBtn.textContent = "Log In as a Student";
        activeRole = 'student';  // Set the role to student
    });

    teacherBtn.addEventListener("click", () => {
        teacherBtn.classList.add("active");
        studentBtn.classList.remove("active");
        loginBtn.textContent = "Log In as a Teacher";
        activeRole = 'teacher';  // Set the role to teacher
    });

    // Handling login button click
    document.getElementById('login-btn').addEventListener('click', async (e) => {
        e.preventDefault();  // Prevent default form submission

        // Collect form data
        const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;

        // Simple validation to check if fields are not empty
        if (!email || !password) {
            alert("Please fill in both email and password.");
            return;
        }

        // Use the active role
        const role = activeRole;

        // Prepare data for API request
        const loginData = {
            email,
            password,
            role,  // Add role to the login data
        };

        try {
            const response = await fetch('/api/auth/login', {  // Updated endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                const { token } = data;  // Assuming the token is returned from the backend
                localStorage.setItem('token', token);  // Store the token in localStorage
                localStorage.setItem('isLoggedIn', 'true');  // ✅ Store login status
                alert("Login successful!");  // Optional: Show a success message
                window.location.href = '/pages/Catalogues/Catlog.html';  // Redirect to the catalog page
            }
             else {
                alert(data.message || "An error occurred during login.");
            }
        } catch (error) {
            console.error(error);  // Log error for debugging
            alert("An error occurred. Please try again.");
        }
    });
});
