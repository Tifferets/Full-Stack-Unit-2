// Import user data functions from users.js
import { updateUser, searchUser, displayLeaderboard } from './users.js';

// Game state variables
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

// Winning combinations
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// DOM Elements
const username = sessionStorage.getItem('username');
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const resetButton = document.getElementById("reset");
const progressFillElement = document.getElementById("progress-fill");
const progressTextElement = document.getElementById("progress-text");
let userData;

// Initialize the game board
async function createBoard() {
  userData = await searchUser(username); // Load user data before creating board
  console.log(userData);
  boardElement.innerHTML = ""; // Clear the board
 
  for (let i = 0; i < 9; i++) {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.dataset.index = i; 
    cellElement.addEventListener("click", handleCellClick);
    boardElement.appendChild(cellElement);
  }
  updateProgressBar(); // Reset the progress bar
  await displayLeaderboard("Tic Tac Toe"); // Display the leaderboard
}

// Handle cell click
function handleCellClick(event) {
  const cellIndex = event.target.dataset.index;

  // Check if the cell is already taken or the game is inactive
  if (board[cellIndex] !== "" || !gameActive) {
    return;
  }

  // Update the board and UI
  board[cellIndex] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.dataset.player = currentPlayer;
  event.target.classList.add("taken");

  // Check for a win or draw
  if (checkWin()) {
    handleWin();
  } else if (board.every(cell => cell !== "")) {
    handleDraw();
  } else {
    // Switch players
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusElement.innerHTML = `Player <span class="player-${currentPlayer.toLowerCase()}">${currentPlayer}</span>'s turn`;
    updateProgressBar();
  }

}

// Handle win
async function handleWin() {
  highlightWinningCells();
  statusElement.innerHTML = `<span class="winning-message">Player ${currentPlayer} wins!</span>`;
  progressFillElement.style.width = "100%"; // Progress bar goes to 100%
  progressTextElement.textContent = "100%"; // Update progress text
  gameActive = false;

  // Track wins
  const updatedWins = userData.activities["Tic Tac Toe"].wins + 1;
  const updatedPlayed = userData.activities["Tic Tac Toe"].played + 1;
  await updateUser(username, { 
    activities: {
      ...userData.activities,
      "Tic Tac Toe": {
        wins: updatedWins,
        played: updatedPlayed
      }
    }
});

  // Check for achievement
  const winRate = userData.activities["Tic Tac Toe"].wins / userData.activities["Tic Tac Toe"].played;
  if (userData.activities["Tic Tac Toe"].played >=10 && 
    winRate >= 0.75 && !userData.achievements.includes("Tic Tac Toe Master")
  ) {
    const updatedAchievements = [...userData.achievements, "Tic Tac Toe Master"]; 
    await updateUser(username, { achievements: updatedAchievements});
    alert("Congratulations! You've unlocked the 'Tic Tac Toe Master' achievement!");
  }
}

// Handle draw
async function handleDraw() {
  highlightDraw();
  statusElement.textContent = "It's a draw!";
  gameActive = false;
  updateProgressBar();

  // Update played games
  const updatedPlayed = userData.activities["Tic Tac Toe"].played + 1;
  const ticTacToeActivity = { ...userData.activities["Tic Tac Toe"], played: updatedPlayed };

  await updateUser(username, { 
    activities: {
      ...userData.activities,
      "Tic Tac Toe": ticTacToeActivity
    }
 });


  // Remove "Tic Tac Toe Master" achievement if win rate falls below 0.75
  if (userData.activities["Tic Tac Toe"].wins / userData.activities["Tic Tac Toe"].played <= 0.75 && 
    userData.achievements.includes("Tic Tac Toe Master")
  ) {
    const updatedAchievements = userData.achievements.filter(achievement => achievement !== "Tic Tac Toe Master");
    await updateUser(username, { achievements: updatedAchievements }); 
    alert("Oh no! Your win rate has dropped. The 'Tic Tac Toe Master' achievement has been withdrawn. Keep playing to earn it back!");

    
  }
}

// Check for a win
function checkWin() {
  return winningCombinations.some(combination => {
    return combination.every(index => board[index] === currentPlayer);
  });
}

// Highlight winning cells
function highlightWinningCells() {
  winningCombinations.forEach(combination => {
    if (combination.every(index => board[index] === currentPlayer)) {
      combination.forEach(index => {
        const cell = document.querySelector(`.cell[data-index='${index}']`);
        cell.classList.add("winning");
      });
    }
  });
}

// Highlight draw cells
function highlightDraw() {
  document.querySelectorAll(".cell").forEach(cell => {
    if (!cell.classList.contains("winning")) {
      cell.classList.add("draw");
    }
  });
}

// Update progress bar
function updateProgressBar() {
  const filledCells = board.filter(cell => cell !== "").length;
  const progress = (filledCells / 9) * 100; // Calculate progress as a percentage
  progressFillElement.style.width = `${progress}%`;
  progressTextElement.textContent = `${Math.round(progress)}%`;
}

// Reset the game
function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusElement.innerHTML = "Player <span class='player-x'>X</span>'s turn";
  createBoard();
}


// Event listeners
resetButton.addEventListener("click", resetGame);

// Initialize the game
createBoard();
