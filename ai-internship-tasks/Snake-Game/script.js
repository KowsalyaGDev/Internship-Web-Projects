// Select the canvas and score elements from the page.
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("finalScore");
const gameOverScreen = document.getElementById("gameOverScreen");
const restartButton = document.getElementById("restartButton");

// Game settings and state.
const gridSize = 20; // Number of cells across the canvas.
const cellSize = canvas.width / gridSize; // Pixel size of each cell.
let snake = [{ x: 9, y: 9 }]; // Snake body cells.
let direction = { x: 0, y: 0 }; // Current movement direction.
let food = { x: 5, y: 5 }; // Food position.
let score = 0; // Player score.
let speed = 6; // Starting speed (frames per second).
let gameInterval = null; // Timer handle.
let isGameOver = false; // Game over flag.

// Generate random food location that does not overlap the snake.
function randomFoodPosition() {
  let position;
  while (!position || snake.some(segment => segment.x === position.x && segment.y === position.y)) {
    position = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  }
  return position;
}

// Reset game values to start a fresh game.
function resetGame() {
  snake = [{ x: 9, y: 9 }];
  direction = { x: 0, y: 0 };
  food = randomFoodPosition();
  score = 0;
  speed = 6;
  isGameOver = false;
  scoreEl.textContent = score;
  gameOverScreen.classList.add("hidden");
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 1000 / speed);
  draw();
}

// Draw the game state on the canvas.
function draw() {
  // Clear the board.
  ctx.fillStyle = "#081623";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food.
  ctx.fillStyle = "#ffcc00";
  ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);

  // Draw snake body.
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#68d391" : "#58b089";
    ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
  });
}

// Update game state on each frame.
function update() {
  if (direction.x === 0 && direction.y === 0) {
    return;
  }

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check collisions with walls.
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    endGame();
    return;
  }

  // Check collisions with itself.
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  // Check if snake ate the food.
  if (head.x === food.x && head.y === food.y) {
    score += 1;
    speed = Math.min(16, speed + 0.5); // Increase speed gradually.
    scoreEl.textContent = score;
    food = randomFoodPosition();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 1000 / speed);
  } else {
    // Remove the tail when food is not eaten.
    snake.pop();
  }
}

// Draw and update in one loop.
function gameLoop() {
  if (isGameOver) return;
  update();
  draw();
}

// Handle keyboard input for arrow keys.
function handleKeydown(event) {
  const key = event.key;

  if (key === "ArrowUp" && direction.y !== 1) {
    direction = { x: 0, y: -1 };
  } else if (key === "ArrowDown" && direction.y !== -1) {
    direction = { x: 0, y: 1 };
  } else if (key === "ArrowLeft" && direction.x !== 1) {
    direction = { x: -1, y: 0 };
  } else if (key === "ArrowRight" && direction.x !== -1) {
    direction = { x: 1, y: 0 };
  }
}

// Stop the game and show the game over screen.
function endGame() {
  isGameOver = true;
  clearInterval(gameInterval);
  finalScoreEl.textContent = score;
  gameOverScreen.classList.remove("hidden");
}

// Attach event listeners.
document.addEventListener("keydown", handleKeydown);
restartButton.addEventListener("click", resetGame);

// Start the game for the first time.
resetGame();
