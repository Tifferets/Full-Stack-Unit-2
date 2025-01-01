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
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const resetButton = document.getElementById("reset");
const progressFillElement = document.getElementById("progress-fill");
const progressTextElement = document.getElementById("progress-text");


// Initialize the game board
function createBoard() {
  boardElement.innerHTML = ""; // Clear the board
  board.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.dataset.index = index;
    cellElement.addEventListener("click", handleCellClick);
    boardElement.appendChild(cellElement);
  });
  updateProgressBar(); // Reset the progress bar
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

  // Set the data-player attribute for styling
  event.target.dataset.player = currentPlayer;

  event.target.classList.add("taken");

  // Check for a win or draw
  if (checkWin()) {
    handleWin();
  } else if (board.every(cell => cell !== "")) {
    highlightDraw();
    statusElement.textContent = "It's a draw!";
    gameActive = false;
    // Update the progress bar
   updateProgressBar();
  } else {
    // Switch players
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusElement.innerHTML = `Player <span class="player-${currentPlayer.toLowerCase()}">${currentPlayer}</span>'s turn`;
    // Update the progress bar
    updateProgressBar();
  }

}

// Handle win
function handleWin() {
  highlightWinningCells();
  statusElement.innerHTML = `<span class="winning-message">Player ${currentPlayer} wins!</span>`;
  progressFillElement.style.width = "100%"; // Progress bar goes to 100%
  progressTextElement.textContent = "100%"; // Update progress text
  gameActive = false;
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
