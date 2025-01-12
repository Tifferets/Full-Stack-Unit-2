const basket = document.getElementById("basket");
const fallingObject = document.getElementById("fallingObject");
const scoreElement = document.getElementById("score");
const resetButton = document.getElementById("resetButton"); // Get the reset button
const gameOverMessage = document.getElementById("gameOverMessage"); // Get the game over message div

let score = 0;
let objectSpeed = 3;
let objectInterval;
let basketPosition = 125; // Starts at the middle of the game area
let isGameOver = false;  // Flag to check if the game is over

function resetObject() {
    const randomX = Math.floor(Math.random() * 270); // Random X position (within the game area)
    fallingObject.style.left = randomX + 'px';
    fallingObject.style.top = '-30px'; // Start above the game area
}

function moveObject() {
    const objectTop = parseInt(fallingObject.style.top);

    if (objectTop > 500) { // If the object goes out of the game area (falls past the bottom)
        stopGame(); // Stop the game
        gameOverMessage.style.display = 'block'; // Show the game over message
        gameOverMessage.textContent = `Game Over! Your score: ${score}`; // Update the game over message
        return; // Exit the function, no further actions needed
    }

    fallingObject.style.top = objectTop + objectSpeed + 'px';

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
    score = 0; // Reset score
    objectSpeed = 3; // Reset object speed
    basketPosition = 125; // Reset basket position
    scoreElement.textContent = score;
    resetObject();
    gameOverMessage.style.display = 'none'; // Hide the game over message
    isGameOver = false; // Reset game over flag
    objectInterval = setInterval(moveObject, 20);
    document.addEventListener("keydown", moveBasket);
}

function stopGame() {
    clearInterval(objectInterval);
    isGameOver = true; // Set game over flag to true
}

// Reset the game
function resetGame() {
    if (!isGameOver) return; // Only reset if the game is over
    stopGame(); // Stop the current game
    startGame(); // Start a new game
}

// Add event listener to reset button
resetButton.addEventListener("click", resetGame);

// Start the game initially
startGame();
