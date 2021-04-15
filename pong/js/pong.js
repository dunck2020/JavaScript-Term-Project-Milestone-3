
var canvas = document.getElementById("myPongGame");
var ctx = canvas.getContext("2d");
var counter = 100;
var upKeyPressed;
var downKeyPressed;
var button = document.getElementById("button");
button.innerHTML = ('<img src="../media/house.png"/>');
button.onclick = (function () {
    window.location.href = "../game_index.html";
})

// Game Objects
var user = {
    x: 0,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "black",
    score: 0
}
var computer = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "black",
    score: 0
}
var center = {
    x: canvas.width / 2 - 1,
    y: 0,
    width: 2,
    height: 10,
    color: "black",
}
var ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 9,
    speed: 5,
    speedX: 5,  //speed of ball horizontally
    speedY: 5,  //speed of ball vertically
    color: "blue",
}


//Functions
function DrawCenterLine() { //draw center line
    for (var i = 0; i <= canvas.height; i += 15) {
        DrawRectangle(center.x, center.y + i, center.width, center.height, center.color);
    }
}
function DrawRectangle(x, y, w, h, color) {  //draw the paddle
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}
function DrawBall(x, y, r, color) { //draw the ball
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}
function ScoreBoard(text, x, y, color) { //load the scoreboard
    ctx.fillStyle = color;
    ctx.font = "30px Verdana";
    ctx.fillText(text, x, y);
}
//this function draws all the game components onto the canvas
function DrawGameComponents() {
    DrawRectangle(0, 0, canvas.width, canvas.height, "blanchedalmond");
    DrawCenterLine();
    DrawBall(ball.x, ball.y, ball.radius, ball.color);
    ScoreBoard(user.score, canvas.width / 4, canvas.height / 5, "black");
    ScoreBoard(computer.score, 3 * canvas.width / 4, canvas.height / 5, "black");
    DrawRectangle(user.x, user.y, user.width, user.height, user.color);
    DrawRectangle(computer.x, computer.y, computer.width, computer.height, computer.color);
}
//function to reset game ball after score
function ResetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    //reset direction of ball
    ball.speedX = -ball.speedX;

}
//detects if ball comes in contact with paddles 
function collisionDetection(ball, player) {
    player.top = player.y;
    player.right = player.x + player.width;
    player.bottom = player.y + player.height;
    player.left = player.x;

    ball.top = ball.y - ball.radius;
    ball.right = ball.x + ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;

    return  (ball.right > player.left) && 
            (ball.top < player.bottom) && 
            (ball.left < player.right) && 
            (ball.bottom > player.top);
}

//main gameplay
function GamePlay() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    //paddle movement
    if (upKeyPressed && user.y > 0){user.y -= 10;}
    if (downKeyPressed && (user.y < canvas.height - user.height)){user.y += 10;} 

    //computer paddle movement
    var computerLevel = 0.1;
    computer.y += (ball.y - (computer.y + computer.height/2)) * computerLevel; 

    //if ball contacts canvas
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.speedY = -ball.speedY;
    }

    //determine player(user or computer) by ball position
    var player = (ball.x < canvas.width / 2) ? user : computer;

    //determine angle to send ball from collision
    if (collisionDetection(ball, player)) {
        var collisionPoint = (ball.y - (player.y + player.height / 2));
        collisionPoint = collisionPoint / (player.height / 2);
        var angleRadian = (Math.PI / 4) * collisionPoint;
        var direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.speedX = direction * ball.speed * Math.cos(angleRadian);
        ball.speedY = direction * ball.speed * Math.sin(angleRadian);

        //increase ball speed with each paddle contact
        ball.speed += 0.5;
    }

    //determine score 
    if (ball.x - ball.radius < 0) {
        computer.score++;
        ResetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        ResetBall();
    }

    //detection for keyboard press to move the player paddle
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    //arrow key pressed
    function keyDownHandler(event) {
        switch (event.keyCode) {
            case 38:
                upKeyPressed = true;
                break;
            case 40:
                downKeyPressed = true;
                break;
        }
    }
    //arrow key release
    function keyUpHandler(event) {
        switch (event.keyCode) {
            case 38:
                upKeyPressed = false;
                break;
            case 40:
                downKeyPressed = false;
                break;
        }
    }


}

function Game() {
    DrawGameComponents();
    GamePlay();
}
setInterval(Game, 15);
