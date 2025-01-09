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
