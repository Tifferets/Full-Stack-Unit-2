//Load JSON Data from local storage
async function loadUserData() {
    const storedData = localStorage.getItem("usersData");
    if (storedData) {
        console.log("Loading user data from local storage.");
        return JSON.parse(storedData);
    } else {
        // Initialize with an empty object if no data in local storage
        console.log("No user data found in local storage. Initializing with empty object.");
        return { users: {} };
    }
}

//Initialize users data in Local Data
export async function initializeUsers() {
    await loadUserData();
}


//Add a User
export async function addUser(username, email, password) {
    const data = await loadUserData();
    
    if (data.users[username]) {
        console.log("User already exists.");
        return false; // User exists
    }
    
    data.users[username] = {
        username: username,
        email: email,
        password: password,
        loginTimes: 0,
        lastLogin: null,
        activities: {
            "Tic Tac Toe": {
                wins: 0,
                played: 0
            },
            "Rock Paper Scissors": {
                wins: 0,
                played: 0
            },
        },
        achievements: []
    };
    
    localStorage.setItem("usersData", JSON.stringify(data));
    console.log("User added successfully.");
    return true; // User added
}

// Update a User
export async function updateUser(username, updates) {
    const data = await loadUserData();
    
    if (!data.users[username]) {
        console.log("User not found.");
        return false; // User doesn't exist
    }
    
    Object.assign(data.users[username], updates);
    localStorage.setItem("usersData", JSON.stringify(data));
    console.log("User updated successfully.");
    return true; // User updated
}

//Search for a User
export async function searchUser(username) {
    const data = await loadUserData();
    return data.users[username] || null; // Return user or null if not found
}


// Fetch and display the leaderboard for a specific game
export async function displayLeaderboard(gameName) {
    const allUsers = await loadUserData(); // Assume a function to fetch all user data
    const leaderboardData = [];
  
    // Calculate the total wins for each user in the specified game
    for (const user of Object.values(allUsers)) {
      if (user.activities && user.activities[gameName]) {
        leaderboardData.push({
          username: user.username,
          wins: user.activities[gameName].wins,
        });
      }
    }
  
    // Sort by wins in descending order
    leaderboardData.sort((a, b) => b.wins - a.wins);
  
    // Display the top players for the specified game
    const leaderboardElement = document.getElementById("leaderboard");
    leaderboardElement.innerHTML = ""; // Clear the leaderboard
    if (leaderboardData.length > 0) {
      leaderboardData.forEach((player, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${index + 1}. ${player.username} - ${player.wins} wins`;
        leaderboardElement.appendChild(listItem);
      });
    } else {
      leaderboardElement.innerHTML = `<li>No players for ${gameName} yet!</li>`;
    }
  }
  
