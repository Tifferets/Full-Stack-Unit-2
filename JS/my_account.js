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
      userSection.innerHTML = `
        <h2>User Information</h2>
        <p>Username: ${userData.username}</p>
        <p>Email: ${userData.email}</p>
        <p>Login Times: ${userData.loginTimes}</p>
        <p>Last Login: ${userData.lastLogin}</p>
        <h3>Game Activities:</h3>
        <ul>
          <li>Tic Tac Toe: Wins: ${userData.activities["Tic Tac Toe"].wins}, Played: ${userData.activities["Tic Tac Toe"].played}</li>
          <li>Rock Paper Scissors: Wins: ${userData.activities["Rock Paper Scissors"].wins}, Played: ${userData.activities["Rock Paper Scissors"].played}</li>
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

displayUserData();