document.addEventListener("DOMContentLoaded", () => {
    const studentBtn = document.getElementById("student-btn");
    const teacherBtn = document.getElementById("teacher-btn");
    const signupBtn = document.getElementById("signup-btn");

    // Initially set active role
    let activeRole = 'student';

    studentBtn.addEventListener("click", () => {
        studentBtn.classList.add("active");
        teacherBtn.classList.remove("active");
        signupBtn.textContent = "Sign Up as a Student";
        activeRole = 'student';  // Set the role to student
    });

    teacherBtn.addEventListener("click", () => {
        teacherBtn.classList.add("active");
        studentBtn.classList.remove("active");
        signupBtn.textContent = "Sign Up as a Teacher";
        activeRole = 'teacher';  // Set the role to teacher
    });

    document.getElementById('signup-btn').addEventListener('click', async (e) => {
        e.preventDefault();  // Prevent default form submission

        // Collect form data
        const full_name = document.querySelector('input[name="full_name"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const mobile = document.querySelector('input[name="mobile"]').value;
        const collegeId = document.querySelector('input[name="collegeId"]').value;
        const password = document.querySelector('input[name="password"]').value;

        // Use the active role
        const role = activeRole;

        // Prepare data for API request
        const userData = {
            full_name,
            email,
            mobile,
            collegeId,
            password,
            role,  // Add role to the data
        };

        try {
            // Send POST request to the backend
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (response.status === 201) {
                alert('Signup successful');
                window.location.href = '/pages/Auth/login.html';// Redirect to login page
            } else {
                alert(result.message);  // Show error message
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Server error! Try again later.');
        }
    });
});
