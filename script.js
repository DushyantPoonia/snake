const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake = [{ x: 200, y: 200 }];
let direction = { x: 20, y: 0 };
let food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
let score = 0;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.forEach(segment => {
        ctx.fillStyle = "green";
        ctx.fillRect(segment.x, segment.y, 20, 20);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById("score").innerText = `Score: ${score}`;
        food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        endGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

document.addEventListener("keydown", event => {
    if (event.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -20 };
    if (event.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 20 };
    if (event.key === "ArrowLeft" && direction.x === 0) direction = { x: -20, y: 0 };
    if (event.key === "ArrowRight" && direction.x === 0) direction = { x: 20, y: 0 };
});

function endGame() {
    alert(`Game Over! Your score: ${score}`);
    submitHighScore(score);  
    document.location.reload();
}

async function submitHighScore(score) {
    try {
        const response = await fetch("/submit-score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ score }),
        });
        const result = await response.json();
        updateHighScores(result.high_scores);
    } catch (error) {
        console.error("Failed to submit high score:", error);
    }
}

async function loadHighScores() {
    try {
        const response = await fetch("/get-scores");
        const highScores = await response.json();
        updateHighScores(highScores);
    } catch (error) {
        console.error("Failed to load high scores:", error);
    }
}

function updateHighScores(highScores) {
    const highScoresElement = document.getElementById("high-scores");
    highScoresElement.innerText = `High Scores: ${highScores.join(", ")}`;
}

function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 100);
}

loadHighScores();  
gameLoop();
