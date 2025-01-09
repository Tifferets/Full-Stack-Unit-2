import { initializeUsers, searchUser, updateUser } from './users.js';

// Initialize user data on page load
initializeUsers();

const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message'); // Assuming you have an element with this ID

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Search for the user
  const user = await searchUser(username);

  // Handle user not found
  if (!user) {
    loginMessage.textContent = 'User not found. Please register.';
    loginMessage.style.color = 'red';
    return;
  }

  // Check if user is blocked
  const blockedUntil = user.blockedUntil || null;
  if (blockedUntil && new Date(blockedUntil) > new Date()) {
    const remainingTime = Math.ceil((new Date(blockedUntil) - Date.now()) / 1000 / 60);
    loginMessage.textContent = `User blocked. Try again in ${remainingTime} minutes.`;
    loginMessage.style.color = 'red';
    return;
  }

  // Validate login credentials
  if (user.password === password) {
    // Reset login times and update last login
    const updatedLoginTimes = user.loginTimes + 1;
    await updateUser(username, { loginTimes: updatedLoginTimes, lastLogin: new Date().toISOString() });

    // Set a session cookie for authentication
    document.cookie = `user=${username}; path=/; max-age=1800`;

    // Access to username through session storage
    sessionStorage.setItem('username', username);
    window.location.href = '../HTML/game_page.html';

  } else {
    // Handle failed login attempts
    const failedAttempts = (user.failedAttempts || 0) + 1;
    const updates = { failedAttempts };

    if (failedAttempts >= 3) {
      updates.blockedUntil = new Date(Date.now() + 3 * 60 * 1000).toISOString(); // Block for 3 minutes
      loginMessage.textContent = 'Too many failed attempts. User blocked for 3 minutes.';
      loginMessage.style.color = 'red';
    } else {
      const remainingAttempts = 3 - failedAttempts;
      loginMessage.textContent = `Incorrect password! ${remainingAttempts} attempts remaining.`;
      loginMessage.style.color = 'red';
    }

    await updateUser(username, updates);
  }
});