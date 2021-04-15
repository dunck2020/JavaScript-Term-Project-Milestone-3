$(document).ready(function () {

    var $button = $('#button');
    $button.html('<img src="../media/house.png"/>');
    $button.click(function() {
        window.location.href = "../game_index.html";
    })
    var canvas = $('#gameHere');
    var ctx = gameHere.getContext("2d");
    var $width = canvas.width();
    var $height = canvas.height();

    const cell = 10; // cell size
    var direction; //default direction for snake movement
    var snakeFood;
    var playerScore;
    var gameLevel;
    var snakeArray;
    var gameSpeed = 100; //default game loop speed
    var snakeEatSound;
    var levelUpSound;
    var snakeDieSound;
    var gameRestart = false;

    function drawGame() {

        ctx.fillStyle = "lightgray";
        ctx.fillRect(0, 0, $width, $height);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, $width, $height);
        snakeEatSound = new sound("media/eatFood.wav");
        levelUpSound = new sound("media/levelUp.wav");
        snakeDieSound = new sound("media/snakeDeath.wav");
        var snakeX = snakeArray[0].x;
        var snakeY = snakeArray[0].y;

        if (direction == 'right')
            snakeX++;

        else if (direction == 'left')
            snakeX--;

        else if (direction == 'up')
            snakeY--;

        else if (direction == 'down')
            snakeY++;

        if (collisionDetector(snakeX, snakeY, snakeArray)) {

            snakeDieSound.play();
            
            init();

            //gameOver();

            return;
        }

        //determine snake contacts food
        if (snakeX == snakeFood.x && snakeY == snakeFood.y) {

            var snakeTail = { x: snakeX, y: snakeY };
            //adjust score
            playerScore++;
            snakeEatSound.play();

            //adjust game speed and level
            if (playerScore == 5 * gameLevel) {
                gameLevel++;
                levelUpSound.play();
                gameSpeed -= 10;
                clearInterval(game_loop);
                game_loop = setInterval(drawGame, gameSpeed);
            }

            //add food back to game canvas
            initialize_food();
        }
        else {

            var snakeTail = snakeArray.pop();
            snakeTail.x = snakeX;
            snakeTail.y = snakeY;
        }

        snakeArray.unshift(snakeTail);

        for (var i = 0; i < snakeArray.length; i++) {

            var s = snakeArray[i];
            drawComponent(s.x, s.y, "blue");
        }

        drawComponent(snakeFood.x, snakeFood.y, "red");

        var playerScoreText = "Score: " + playerScore;
        var gameLevelText = "Level: " + gameLevel;

        ctx.font = "20px Verdana";
        ctx.fillText(playerScoreText, 5, $height - 5);
        ctx.fillText(gameLevelText, 110, $height - 5);
    }

    function drawComponent(x, y, color) {
        //draws components on canvas based on x and y parameters

        ctx.fillStyle = color;
        ctx.fillRect(x * cell, y * cell, cell, cell);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x * cell, y * cell, cell, cell);
    }

    function collisionDetector(snakeX, snakeY, snakeArray) {

        //determines if snake collides with itself
        for (var i = 0; i < snakeArray.length; i++) {

            if (snakeArray[i].x == snakeX && snakeArray[i].y == snakeY) {
                return true;
            }
        }

        //determines if snake collides with wall
        if (snakeX < 0 || snakeY < 0 || snakeX == $width / cell || snakeY == $height / cell) {
            return true;
        }

        //false returned if no collision
        return false;
    }

    function initialize_snake() {

        snakeArray = [];

        var snakeLength = 2;

        for (var i = snakeLength - 1; i >= 0; i--) {
            snakeArray.push({ x: i, y: 0 });
        }
    }

    function initialize_food() {

        snakeFood = { 
            x: Math.round(Math.random() * ($width - cell) / cell), 
            y: Math.round(Math.random() * ($height - cell) / cell)
        };
    }

    function init() {

        direction = 'right';

        initialize_snake();
        initialize_food();

        playerScore = 0; //set score
        gameLevel = 1; // set level

        if (typeof game_loop != 'undefined' || typeof game_loop == gameSpeed) {
            gameSpeed = 100;
            clearInterval(game_loop);
        }
        game_loop = setInterval(drawGame, gameSpeed);
    }

    //help from w3schools
    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
            this.sound.play();
        }
        this.stop = function(){
            this.sound.pause();
        }    
    }

    $(document).keydown(function (e) {

        var key = e.which;

        if (key == "37" && direction != "left" && direction != "right") direction = "left";
        else if (key == "38" && direction != "up" && direction != "down") direction = "up";
        else if (key == "39" && direction != "right" && direction != "left") direction = "right";
        else if (key == "40" && direction != "down" && direction != "up") direction = "down";
    })

    function gameOver() {
        alert("You died! Click ok to restart."); 
    }

    init();
})
