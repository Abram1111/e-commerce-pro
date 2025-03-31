

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const alertBox = document.getElementById('login-alert');

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'products.html';
      } else {
        alertBox.textContent = 'Invalid email or password';
        alertBox.classList.remove('d-none');
      }
    });
  }

  const registerBtn = document.getElementById('register-btn');
  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      const firstName = document.getElementById('first-name').value;
      const lastName = document.getElementById('last-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const alertBox = document.getElementById('register-alert');

      if (password !== confirmPassword) {
        alertBox.textContent = 'Passwords do not match';
        alertBox.className = 'alert alert-danger';
        alertBox.classList.remove('d-none');
        return;
      }

      let users = JSON.parse(localStorage.getItem('users')) || [];
      if (users.find(u => u.email === email)) {
        alertBox.textContent = 'Email already registered';
        alertBox.className = 'alert alert-danger';
        alertBox.classList.remove('d-none');
        return;
      }

      const newUser = { firstName, lastName, email, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      alertBox.textContent = 'Registration successful! You can now login.';
      alertBox.className = 'alert alert-success';
      alertBox.classList.remove('d-none');
    });
  }
});