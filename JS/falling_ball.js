// Import user data functions from users.js
import { updateUser, searchUser, displayLeaderboard } from './users.js';

const username = sessionStorage.getItem('username');
const basket = document.getElementById("basket");
const fallingObject = document.getElementById("fallingObject");
const scoreElement = document.getElementById("score");
const resetButton = document.getElementById("resetButton"); // Get the reset button
const gameOverMessage = document.getElementById("gameOverMessage"); // Get the game over message div
let userData;

let score = 0;
let objectSpeed = 3;
let objectInterval;
let basketPosition = 125; // Starts at the middle of the game area
let isGameOver = false; // Flag to check if the game is over

async function saveGameResult() {
    if (!userData) {
        console.error("User data not found. Cannot save game result.");
        return;
    }

    // Track wins
      const updatedWins = userData.activities["Falling Ball"].wins + score;
      console.log(userData.activities["Falling Ball"].wins );
      console.log(score);
      const updatedPlayed = userData.activities["Falling Ball"].played + 1;
      await updateUser(username, { 
        activities: {
          ...userData.activities,
          "Falling Ball": {
            wins: updatedWins,
            played: updatedPlayed
          }
        }
    });

      // Check for achievement
      //const winRate = userData.activities["Falling Ball"].wins / userData.activities["Falling Ball"].played;
      if (userData.activities["Falling Ball"].played >=10 && 
        score >= 5 + userData.activities["Falling Ball"].played && !userData.achievements.includes("Falling Ball Master")
      ) {
        const updatedAchievements = [...userData.achievements, "Falling Ball Master"]; 
        await updateUser(username, { achievements: updatedAchievements});
        alert("Congratulations! You've unlocked the 'Falling Ball Master' achievement!");
      }

      // Remove "Falling Ball Master" achievement if win rate falls below 0.75
        else if (score <= 5 + userData.activities["Falling Ball"].played  && 
          userData.achievements.includes("Falling Ball Master")
        ) {
          const updatedAchievements = userData.achievements.filter(achievement => achievement !== "Falling Ball Master");
          await updateUser(username, { achievements: updatedAchievements }); 
          alert("Oh no! Your win rate has dropped. The 'Falling Ball Master' achievement has been withdrawn. Keep playing to earn it back!");
        }
}

function resetObject() {
    const randomX = Math.floor(Math.random() * 270); // Random X position (within the game area)
    fallingObject.style.left = randomX + "px";
    fallingObject.style.top = "-30px"; // Start above the game area
}

function moveObject() {
    const objectTop = parseInt(fallingObject.style.top);

    if (objectTop > 500) {
        // If the object goes out of the game area (falls past the bottom)
        stopGame(); // Stop the game 
        return; // Exit the function, no further actions needed
    }

    fallingObject.style.top = objectTop + objectSpeed + "px";

    const objectX = parseInt(fallingObject.style.left);
    const objectY = parseInt(fallingObject.style.top);

    // Check for collision with the basket
    if (
        objectY > 470 &&
        objectY < 500 &&
        objectX >= basketPosition &&
        objectX <= basketPosition + 50
    ) {
        score++;
        scoreElement.textContent = score;
        resetObject();
        // Increase the speed every 5 points
        if (score % 5 === 0) {
            objectSpeed++;
        }
    }
}

function moveBasket(event) {
    const gameArea = document.querySelector(".game-area");
    const gameAreaWidth = gameArea.offsetWidth;

    if (event.key === "ArrowLeft" || event.key === "a") {
        basketPosition -= 20;
        if (basketPosition < 0) basketPosition = 0;
    } else if (event.key === "ArrowRight" || event.key === "d") {
        basketPosition += 20;
        if (basketPosition > gameAreaWidth - 50) basketPosition = gameAreaWidth - 50;
    }

    // Update the basket's position
    basket.style.left = basketPosition + "px";
}

async function startGame() {
    userData = await searchUser(username); // Load user data before creating board
    console.log(userData);

    score = 0; // Reset score
    objectSpeed = 3; // Reset object speed
    basketPosition = 125; // Reset basket position
    scoreElement.textContent = score;
    resetObject();
    gameOverMessage.style.display = "none"; // Hide the game over message
    isGameOver = false; // Reset game over flag
    objectInterval = setInterval(moveObject, 20);
    document.addEventListener("keydown", moveBasket);

    // Display the leaderboard (ensure the function is correctly implemented)
    if (typeof displayLeaderboard === "function") {
        await displayLeaderboard("Falling Ball");
    } else {
        console.error("displayLeaderboard function is not defined");
    }
}

async function stopGame() {
    clearInterval(objectInterval);
    isGameOver = true; // Set game over flag to true
    // Update game over message
    gameOverMessage.style.display = "block";
    gameOverMessage.textContent = `Game Over! Your score is: ${score}`;
    // Save the game result
    await saveGameResult();
    // Update leaderboard
    await displayLeaderboard("Falling Ball");
}

// Reset the game
function resetGame() {
    if (!isGameOver) return; // Only reset if the game is over
    startGame(); // Start a new game
}

// Add event listener to reset button
resetButton.addEventListener("click", resetGame);

// Start the game initially
startGame();
