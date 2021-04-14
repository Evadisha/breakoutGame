const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

// Creating props
// 1. Ball props
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4
}

// 2. Paddle props
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0
}

// 3. Brick props
const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
}

// Creating Bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++){
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++){
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = { x, y, ...brickInfo };
    }
}

// Functions
// 1. Draw ball on canvas 
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
}

// 2. Draw paddle on canvas 
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
}

// 3. Draw score on canvas
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// 4. Draw bricks on canvas
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
     });
}

// 5. Move paddle on canvas
function movePaddle() {
    paddle.x += paddle.dx;

    // Wall detection
    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w ;
    }

    if (paddle.x < 0) {
        paddle.x = 0;
    }

}

// 6. To increase score
function increaseScore() {
    score++;

    if (score % (brickRowCount * brickRowCount) === 0) {
        showAllBricks();
    }
}

// 7. Move ball on canvas
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision(right/left)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }
    
    // Wall collision(top/bottom)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    // Paddle collision
    if (
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -ball.speed;
    }

    // Brick collision
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (
                    ball.x - ball.size > brick.x && //left brick side check
                    ball.x + ball.size < brick.x + brick.w && //right brick side check
                    ball.y + ball.size > brick.y && //top brick check
                    ball.y - ball.size < brick.y + brick.h // bottom brick check
                ) {
                    ball.dy *= -1;
                    brick.visible = false;

                    increaseScore();
                }
            }
        });
    });

    // Hit bottom wall - Lose
    if (ball.y + ball.size > canvas.height) {
        alert('You Lost!\nTry Again');
        showAllBricks();
        score = 0;
    }

}


// 8. Drawing canvas
function draw() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
}

// 9. Update canvas drawing and animation
function update() {
    movePaddle();
    moveBall();

    // Drawing everything
    draw();

    requestAnimationFrame(update);
}

// 10. Keydown event
function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    }
    else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
}

// 11. Keyup event
function keyUp(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight'
        || e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = 0;
        }
}

// 12. Make all bricks appear
function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => (brick.visible = true));
    });
}

// Init functions
update();

// Event listeners
// 1. Show rules button
rulesBtn.addEventListener('click', () => rules.classList.add('show'));

// 2. Close button 
closeBtn.addEventListener('click', () => rules.classList.remove('show'));

// 3. Keyboard event handlers for moving paddle
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);