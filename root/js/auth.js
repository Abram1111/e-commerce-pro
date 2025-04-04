document.addEventListener("DOMContentLoaded", () => {
  // Handle user login
  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      // Retrieve user input from login form
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;
      const alertBox = document.getElementById("login-alert");
      // Get stored users from localStorage (if any)
      const users = JSON.parse(localStorage.getItem("users")) || [];
      // Check if user exists with matching email and password
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // Store logged-in user data in localStorage
        localStorage.setItem("user", JSON.stringify(user));
        // Redirect to products page upon successful login
        window.location.href = "products.html";
      } else {
        // Display error message if credentials are invalid
        alertBox.textContent = "Invalid email or password";
        alertBox.classList.remove("d-none");
      }
    });
  }

  // Handle user registration
  const registerBtn = document.getElementById("register-btn");
  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      // Retrieve user input from registration form
      const firstName = document.getElementById("first-name").value;
      const lastName = document.getElementById("last-name").value;
      const email = document.getElementById("register-email").value;
      const password = document.getElementById("register-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      const alertBox = document.getElementById("register-alert");
      // Validate password confirmation
      if (password !== confirmPassword) {
        alertBox.textContent = "Passwords do not match";
        alertBox.className = "alert alert-danger";
        alertBox.classList.remove("d-none");
        return;
      }
      // Retrieve stored users from localStorage (if any)
      let users = JSON.parse(localStorage.getItem("users")) || [];
      // Check if the email is already registered
      if (users.find((u) => u.email === email)) {
        alertBox.textContent = "Email already registered";
        alertBox.className = "alert alert-danger";
        alertBox.classList.remove("d-none");
        return;
      }
      // Create new user object and store it in localStorage
      const newUser = { firstName, lastName, email, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      // Display success message
      alertBox.textContent = "Registration successful! You can now login.";
      alertBox.className = "alert alert-success";
      alertBox.classList.remove("d-none");
    });
  }
});
