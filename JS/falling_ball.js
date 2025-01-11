// Import user data functions from users.js
import { updateUser, searchUser, displayLeaderboard } from './users.js';

const basket = document.getElementById("basket");
const fallingObject = document.getElementById("fallingObject");
const scoreElement = document.getElementById("score");

let score = 0;
let objectSpeed = 3;
let objectInterval;
let isGameOver = false;

// Set initial position of the basket
let basketPosition = 125; // Starts at the middle of the game area

function resetObject() {
    const randomX = Math.floor(Math.random() * 270); // Random X position (within the game area)
    fallingObject.style.left = randomX + 'px';
    fallingObject.style.top = '-30px'; // Start above the game area
}

function moveObject() {
    const objectTop = parseInt(fallingObject.style.top);
    if (objectTop > 500) { // If the object goes out of the game area
        resetObject();
    } else {
        fallingObject.style.top = objectTop + objectSpeed + 'px';
    }

    const objectX = parseInt(fallingObject.style.left);
    const objectY = parseInt(fallingObject.style.top);

    // Check for collision with the basket
    if (
        objectY > 470 && objectY < 500 &&
        objectX >= basketPosition && objectX <= basketPosition + 50
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

function startGame() {
    resetObject();
    objectInterval = setInterval(moveObject, 20);
    document.addEventListener("keydown", moveBasket);
}

function stopGame() {
    clearInterval(objectInterval);
    
    isGameOver = true;
}
// Reset the game
function resetGame() {
    console.log("9999");
    stopGame();
    scoreElement.innerHTML= "<span id='score'>0</span> ";
    startGame();
  }
  
  
  // Event listeners
  resetButton.addEventListener("click", resetGame);

startGame();
