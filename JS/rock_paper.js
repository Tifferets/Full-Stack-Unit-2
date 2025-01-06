// Variables and DOM elements
const choices = document.querySelectorAll(".choice");
const userScoreSpan = document.getElementById("user-score");
const computerScoreSpan = document.getElementById("computer-score");
const message = document.getElementById("message");
const result = document.getElementById("result");
const resetButton = document.getElementById("reset");

// Local storage keys
const USER_SCORE_KEY = "userScore";
const COMPUTER_SCORE_KEY = "computerScore";

// Initialize scores and difficulty
let userScore = parseInt(localStorage.getItem(USER_SCORE_KEY)) || 0;
let computerScore = parseInt(localStorage.getItem(COMPUTER_SCORE_KEY)) || 0;
let difficulty = "easy"; // Default difficulty
updateScores();

// Event listeners
choices.forEach(choice => {
    choice.addEventListener("click", () => playGame(choice.dataset.choice));
});
resetButton.addEventListener("click", resetGame);

// Set difficulty
function setDifficulty(level) {
    difficulty = level;
    message.textContent = `Difficulty set to: ${level.toUpperCase()}`;
}

// Play the game
function playGame(userChoice) {
    const computerChoice = getComputerChoice(userChoice);
    const winner = determineWinner(userChoice, computerChoice);
    animateChoice(userChoice, computerChoice);

    if (winner === "user") {
        userScore++;
        localStorage.setItem(USER_SCORE_KEY, userScore);
        result.textContent = `You win! ${userChoice} beats ${computerChoice}.`;
    } else if (winner === "computer") {
        computerScore++;
        localStorage.setItem(COMPUTER_SCORE_KEY, computerScore);
        result.textContent = `You lose! ${computerChoice} beats ${userChoice}.`;
    } else {
        result.textContent = "It's a draw!";
    }

    updateScores();
}

function getComputerChoice(userChoice = null) {
    const choices = ["rock", "paper", "scissors"];
    
    if (difficulty === "easy") {
        // Random choice for easy difficulty
        return choices[Math.floor(Math.random() * choices.length)];
    } else if (difficulty === "medium" && userChoice) {
        // Medium: Bias towards countering user's last choice
        const randomFactor = Math.floor(Math.random() * 3); // 0-6
        if (randomFactor === 0) {
            // Occasionally lose: Pick a choice that the user beats
            return choices[(choices.indexOf(userChoice) + 2) % 3];
        } else {
            // Counter user's choice
            return choices[(choices.indexOf(userChoice) + 1) % 3];
        }

    } else if (difficulty === "hard" && userChoice) {
        // Hard: Counter user's choice but occasionally lose (1 in 7 games)
        const randomFactor = Math.floor(Math.random() * 7); // 0-6
        if (randomFactor === 0) {
            // Occasionally lose: Pick a choice that the user beats
            return choices[(choices.indexOf(userChoice) + 2) % 3];
        } else {
            // Counter user's choice
            return choices[(choices.indexOf(userChoice) + 1) % 3];
        }
    }

    // Default fallback for computer choice
    return choices[Math.floor(Math.random() * choices.length)];
}


// Determine winner
function determineWinner(userChoice, computerChoice) {
    if (userChoice === computerChoice) return "draw";
    if (
        (userChoice === "rock" && computerChoice === "scissors") ||
        (userChoice === "paper" && computerChoice === "rock") ||
        (userChoice === "scissors" && computerChoice === "paper")
    ) {
        return "user";
    } else {
        return "computer";
    }
}

// Update scores
function updateScores() {
    userScoreSpan.textContent = userScore;
    computerScoreSpan.textContent = computerScore;
}

// Reset game
function resetGame() {
    userScore = 0;
    computerScore = 0;
    localStorage.setItem(USER_SCORE_KEY, userScore);
    localStorage.setItem(COMPUTER_SCORE_KEY, computerScore);
    updateScores();
    result.textContent = "";
    message.textContent = "Choose your move:";
}

// Animate choices
function animateChoice(userChoice, computerChoice) {
    const messageBox = document.getElementById("message");
    messageBox.innerHTML = `
        <div class="animation">
            <span class="user-choice">${getIcon(userChoice)}</span>
            <span class="vs">VS</span>
            <span class="computer-choice">${getIcon(computerChoice)}</span>
        </div>
    `;

    const animation = document.querySelector(".animation");
    animation.classList.add("animate");

    setTimeout(() => {
        animation.classList.remove("animate");
    }, 2000);
}

// Get icon for choices
function getIcon(choice) {
    return choice === "rock" ? "🪨" : choice === "paper" ? "📄" : "✂️";
}
