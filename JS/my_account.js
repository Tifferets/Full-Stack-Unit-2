import { searchUser } from './users.js'; // Import necessary functions

async function displayUserData() {

  const username = sessionStorage.getItem('username');

  if (!username) {
    console.error("Username not found in query parameter.");
    return;
  }

  try {
    const userData = await searchUser(username);
    const container = document.querySelector('.container');

    if (userData) {
      const userSection = document.createElement('div');
      userSection.classList.add('user-data'); // Add a class for styling
      const formattedLastLogin = userData.lastLogin ? formatDate(new Date(userData.lastLogin)) : 'Not available';

      userSection.innerHTML = `
        <h2>User Information</h2>
        <p>Username: ${userData.username}</p>
        <p>Email: ${userData.email}</p>
        <p>Login Times: ${userData.loginTimes}</p>
        <p>Last Login: ${formattedLastLogin}</p>
        <h3>Game Activities:</h3>
        <ul>
          <li>Tic Tac Toe: Wins: ${userData.activities["Tic Tac Toe"].wins}, Played: ${userData.activities["Tic Tac Toe"].played}</li>
          <li>Falling Ball: Wins: ${userData.activities["Falling Ball"].wins}, Played: ${userData.activities["Falling Ball"].played}</li>
        </ul>
        <h3>Achievements:</h3>
        <ul>
          ${userData.achievements.length > 0 ? userData.achievements.map(achievement => `<li>${achievement}</li>`).join('') : '<li>No achievements yet.</li>'}
        </ul>
      `;

      container.appendChild(userSection);
    } else {
      console.error("User not found.");
      // Display an error message to the user
      const container = document.querySelector('.container');
      container.innerHTML += "<p>User not found.</p>";

    }
  } catch (error) {
    console.error("Error loading user data:", error);
    // Display an error message to the user
    const container = document.querySelector('.container');
    container.innerHTML += "<p>Error loading user data. Please try again later.</p>";
  }
}

// Function to format the date in dd/mm/yyyy HH:MM:SS format
function formatDate(date) {

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

displayUserData();