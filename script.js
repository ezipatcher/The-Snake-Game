const boardSize = 20;
const gameArea = document.getElementById("game-area");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

let snake = [42]; // start position
let direction = 1; // right
let food = 0;
let score = 0;
let interval = null;
let speed = 200;

function createBoard() {
  gameArea.innerHTML = "";
  for (let i = 0; i < boardSize * boardSize; i++) {
    const div = document.createElement("div");
    div.classList.add("pixel");
    gameArea.appendChild(div);
  }
}

function draw() {
  const pixels = document.querySelectorAll(".pixel");
  pixels.forEach(p => p.className = "pixel");

  snake.forEach(index => pixels[index]?.classList.add("snake"));
  pixels[food]?.classList.add("food");
}

function randomFood() {
  let newFood;
  do {
    newFood = Math.floor(Math.random() * boardSize * boardSize);
  } while (snake.includes(newFood));
  return newFood;
}

function move() {
  const head = snake[snake.length - 1];
  let next = head + direction;

  // Edge collision
  const hitLeft = direction === -1 && head % boardSize === 0;
  const hitRight = direction === 1 && head % boardSize === boardSize - 1;
  const hitTop = direction === -boardSize && head < boardSize;
  const hitBottom = direction === boardSize && head >= boardSize * (boardSize - 1);

  if (hitLeft || hitRight || hitTop || hitBottom || snake.includes(next)) {
    gameOver();
    return;
  }

  snake.push(next);

  if (next === food) {
    eatSound.play();
    score++;
    scoreEl.textContent = score;
    food = randomFood();
    if (score % 5 === 0) speedUp();
  } else {
    snake.shift();
  }

  draw();
}

function changeDirection(e) {
  switch (e.key) {
    case "ArrowUp":
      if (direction !== boardSize) direction = -boardSize;
      break;
    case "ArrowDown":
      if (direction !== -boardSize) direction = boardSize;
      break;
    case "ArrowLeft":
      if (direction !== 1) direction = -1;
      break;
    case "ArrowRight":
      if (direction !== -1) direction = 1;
      break;
  }
}

function startGame() {
  createBoard();
  snake = [42];
  direction = 1;
  food = randomFood();
  score = 0;
  speed = 200;
  scoreEl.textContent = score;
  draw();
  clearInterval(interval);
  interval = setInterval(move, speed);
}

function gameOver() {
  clearInterval(interval);
  gameOverSound.play();
  alert("💀 GAME OVER! Final Score: " + score);
  saveHighScore();
}

function saveHighScore() {
  const high = localStorage.getItem("snakeHigh") || 0;
  if (score > high) {
    localStorage.setItem("snakeHigh", score);
    highScoreEl.textContent = score;
  }
}

function speedUp() {
  clearInterval(interval);
  speed = Math.max(60, speed - 20); // don’t go below 60ms
  interval = setInterval(move, speed);
}

// Load high score
highScoreEl.textContent = localStorage.getItem("snakeHigh") || 0;
document.addEventListener("keydown", changeDirection);
