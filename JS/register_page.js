import { addUser, searchUser } from './users.js';

const registerForm = document.getElementById('register-form');
const registerMessage = document.getElementById('register-message');

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  // Validate password length
  if (password.length < 6) {
    registerMessage.textContent = 'Password must be at least 6 characters long.';
    registerMessage.style.color = 'red';
    return;
  }

  // Validate password confirmation
  if (password !== confirmPassword) {
    registerMessage.textContent = 'Passwords do not match. Please try again.';
    registerMessage.style.color = 'red';
    return;
  }

  // Check if username already exists
  const userExists = await searchUser(username);
  console.log(userExists);
  if (userExists != null) {
    registerMessage.textContent = 'Username already exists. Please choose another.';
    registerMessage.style.color = 'red';
    return;
  }

  // Attempt to register the user
  const success = await addUser(username, email, password);

  if (success) {
    registerMessage.textContent = 'Registration successful! You can now log in.';
    registerMessage.style.color = 'green';
    window.location.href = 'index.html';
  } else {
    registerMessage.textContent = 'Registration failed. Try again.';
    registerMessage.style.color = 'red';
  }
});