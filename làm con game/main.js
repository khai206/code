const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreValue = document.querySelector('.score-value');
const highScoreValue = document.querySelector('.high-score-value');
const finalScore = document.getElementById('final-score');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const restartBtn = document.getElementById('restart-btn');
const gameOverScreen = document.querySelector('.game-over');
const eatSound = document.getElementById('eat-sound');
const gameOverSound = document.getElementById('game-over-sound');

const gridSize = 20;
canvas.width = 700;
canvas.height = 400;

let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let gameSpeed = 150;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gameLoop;

highScoreValue.textContent = highScore;

function initGame() {
    snake = [
        {x: 100, y: 200},
        {x: 80, y: 200},
        {x: 60, y: 200}
    ];
    generateFood();
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    scoreValue.textContent = score;
    gameSpeed = 150;
    gameOverScreen.style.display = 'none';
}

function generateFood() {
    const maxX = canvas.width / gridSize - 1;
    const maxY = canvas.height / gridSize - 1;
    food = {
        x: Math.floor(Math.random() * maxX) * gridSize,
        y: Math.floor(Math.random() * maxY) * gridSize
    };
}

function draw() {
    ctx.fillStyle = '#0d1b2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0fcc45';
    snake.forEach((segment) => ctx.fillRect(segment.x, segment.y, gridSize, gridSize));

    ctx.fillStyle = '#e63946';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function update() {
    direction = nextDirection;
    const head = {x: snake[0].x, y: snake[0].y};
    if (direction === 'up') head.y -= gridSize;
    if (direction === 'down') head.y += gridSize;
    if (direction === 'left') head.x -= gridSize;
    if (direction === 'right') head.x += gridSize;

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return gameOver();
    }
    for (let part of snake) {
        if (part.x === head.x && part.y === head.y) return gameOver();
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        eatSound.play();
        score += 10;
        scoreValue.textContent = score;
        generateFood();
        if (gameSpeed > 50) gameSpeed -= 5;
    } else {
        snake.pop();
    }
}

function game() {
    update();
    draw();
    if (gameRunning) gameLoop = setTimeout(game, gameSpeed);
}

function gameOver() {
    gameRunning = false;
    clearTimeout(gameLoop);
    gameOverSound.play();
    if (score > highScore) {
        highScore = score;
        highScoreValue.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    }
    finalScore.textContent = score;
    gameOverScreen.style.display = 'flex';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== 'down') nextDirection = 'up';
    if (e.key === 'ArrowDown' && direction !== 'up') nextDirection = 'down';
    if (e.key === 'ArrowLeft' && direction !== 'right') nextDirection = 'left';
    if (e.key === 'ArrowRight' && direction !== 'left') nextDirection = 'right';
});

startBtn.onclick = () => { if (!gameRunning) { gameRunning = true; game(); } };
pauseBtn.onclick = () => { gameRunning = !gameRunning; if (gameRunning) game(); };
resetBtn.onclick = () => { initGame(); draw(); };
restartBtn.onclick = () => { initGame(); gameRunning = true; game(); };

initGame();
draw();
