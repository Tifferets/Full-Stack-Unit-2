// Mock database for users
const users = {};
const failedAttempts = {}; // Tracks failed login attempts for each user
const blockedUsers = {}; // Tracks blocked users with their unblocking time

// Utility to set cookies
function setCookie(name, value, minutes) {
  const date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

// Utility to get cookies
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const [key, value] = cookies[i].split("=");
    if (key === name) return value;
  }
  return null;
}

// Handle Login
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nickname = document.getElementById("login-nickname").value;
  const password = document.getElementById("login-password").value;

  // Check if the user is blocked
  if (blockedUsers[nickname]) {
    const unblockTime = blockedUsers[nickname];
    const remainingTime = Math.ceil((unblockTime - Date.now()) / 1000 / 60);
    if (remainingTime > 0) {
      document.getElementById("login-message").textContent = `User blocked. Try again in ${remainingTime} minutes.`;
      document.getElementById("login-message").style.color = "red";
      return;
    } else {
      delete blockedUsers[nickname]; // Unblock the user after the time expires
    }
  }

  // Validate login credentials
  if (users[nickname] && users[nickname].password === password) {
    // Reset failed attempts on successful login
    failedAttempts[nickname] = 0;

    // Set a cookie for the session (expires in 30 minutes)
    setCookie("user", nickname, 30);

    document.getElementById("login-message").textContent = `Welcome back, ${nickname}!`;
    document.getElementById("login-message").style.color = "green";
    
    // Redirect to the game page
    setTimeout(() => {
        window.location.href = "../HTML/game_page.html"; // Replace with the actual path to your game page
    }, 2000); // Redirect after 2 seconds
} else if (users[nickname]) {
    // Increment failed attempts
    failedAttempts[nickname] = (failedAttempts[nickname] || 0) + 1;

    if (failedAttempts[nickname] >= 3) {
      blockedUsers[nickname] = Date.now() + 3 * 60 * 1000; // Block for 3 minutes
      document.getElementById("login-message").textContent = "Too many failed attempts. User blocked for 3 minutes.";
      document.getElementById("login-message").style.color = "red";
    } else {
      const remainingAttempts = 3 - failedAttempts[nickname];
      document.getElementById("login-message").textContent = `Incorrect password! ${remainingAttempts} attempts remaining.`;
      document.getElementById("login-message").style.color = "red";
    }
  } else {
    document.getElementById("login-message").textContent = "User not found. Please register.";
    document.getElementById("login-message").style.color = "red";
  }
});

// Handle Registration
document.getElementById("register-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const nickname = document.getElementById("register-nickname").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
  
    // Check if nickname already exists
    if (users[nickname]) {
      document.getElementById("register-message").textContent = "Nickname already exists. Please choose another.";
      document.getElementById("register-message").style.color = "red";
    } else if (password.length < 6) {
      document.getElementById("register-message").textContent = "Password must be at least 6 characters long.";
      document.getElementById("register-message").style.color = "red";
    } else if (password !== confirmPassword) {
      document.getElementById("register-message").textContent = "Passwords do not match. Please try again.";
      document.getElementById("register-message").style.color = "red";
    } else {
      // Store user details in the database
      users[nickname] = {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      };
  
      document.getElementById("register-message").textContent = "Registration successful! You can now log in.";
      document.getElementById("register-message").style.color = "green";

      // Clear form inputs after successful registration
      document.getElementById("register-form").reset();
    }
  });
