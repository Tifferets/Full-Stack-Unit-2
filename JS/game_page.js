// DOM Elements
const azLink = document.querySelector(".nav-links a[href='#az']");
const gameGrid = document.querySelector(".game-grid");

const searchBar = document.getElementById("search-bar");
const gameCards = document.querySelectorAll(".game-card");

const ticTacToeCard = document.getElementById("tic-tac-toe");
const rockPaperScissorsCard = document.getElementById("falling-ball");


// Sort game cards alphabetically when "A-Z" is clicked
azLink.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent the default behavior of the link
  
  // Get all game cards
  const gameCards = Array.from(gameGrid.children);
  
  // Sort cards by their text content
  gameCards.sort((a, b) => {
    const titleA = a.querySelector(".game-title").textContent.toLowerCase();
    const titleB = b.querySelector(".game-title").textContent.toLowerCase();
    return titleA.localeCompare(titleB);
  });

    // Clear and re-append sorted cards to the grid
    gameGrid.innerHTML = ""; // Clear current cards
    gameCards.forEach(card => gameGrid.appendChild(card)); // Append sorted cards
});


// Add an input event listener to the search bar
searchBar.addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase(); // Convert input to lowercase
  gameCards.forEach((card) => {
    const gameTitle = card.textContent.toLowerCase(); // Get card title in lowercase
    if (gameTitle.includes(searchTerm)) {
      card.style.display = "block"; // Show matching cards
    } else {
      card.style.display = "none"; // Hide non-matching cards
    }
  });
});


// Redirect to the Tic Tac Toe page when the card is clicked
ticTacToeCard.addEventListener("click", () => {
  window.location.href = "../HTML/tic_tac_toe.html"; 
});

// Redirect to the rock paper scissors page when the card is clicked
rockPaperScissorsCard.addEventListener("click", () => {
  window.location.href = "../HTML/falling_ball.html"; 
});