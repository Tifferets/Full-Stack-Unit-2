// DOM Elements
const ticTacToeCard = document.getElementById("tic-tac-toe");
const rockPaperScissorsCard = document.getElementById("rock-paper-scissors");

// Redirect to the Tic Tac Toe page when the card is clicked
ticTacToeCard.addEventListener("click", () => {
  window.location.href = "../HTML/tic_tac_toe.html"; 
});

// Redirect to the rock paper scissors page when the card is clicked
rockPaperScissorsCard.addEventListener("click", () => {
  window.location.href = "../HTML/rock_paper_scissors.html"; 
});