_STAR_WIDTH = 35;
_STAR_HEIGHT = 35;
_STAR_COUNTER = 0;

function CoolGame() {
    this.fps = 60;
    this.canvas = null;
    this.width = 0;
    this.width = 0;
    this.minVelocity = 200;
    this.maxVelocity = 3000;
    this.stars = 25;
    this.intervalId = 0;
}

function Star(x, y, width, height, velocity, image) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = 44;
    this.color = '#fff';
    this.image = new Image();
    this.image.src = "ball.png";
}

//The main function - initialises the coolGame.
CoolGame.prototype.initialise = function (div) {
    var self = this;

    //Store the div.
    this.containerDiv = div;
    self.width = window.innerWidth;
    self.height = window.innerHeight;

    window.onresize = function (event) {
        self.width = window.innerWidth;
        self.height = window.innerHeight;
        self.canvas.width = self.width;
        self.canvas.height = self.height;
        self.draw();
    }

    //Create the canvas.
    var canvas = document.createElement('canvas');
    div.appendChild(canvas);
    this.canvas = canvas;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
};

CoolGame.prototype.start = function () {

    //Create the stars.
    var stars = [];
    for (var i = 0; i < this.stars; i++) {
        stars[i] = new Star(Math.random() * this.width, Math.random() * this.height, _STAR_WIDTH, _STAR_HEIGHT);
    }
    this.stars = stars;

    var self = this;
    //Start the timer.
    this.intervalId = setInterval(function () {
        self.update();
        self.draw();
    }, 1000 / this.fps);
};

CoolGame.prototype.stop = function () {
    clearInterval(this.intervalId);
};

CoolGame.prototype.update = function () {
    var dt = 1 / this.fps;

    for (var i = 0; i < this.stars.length; i++) {
        var star = this.stars[i];
        star.y += dt * star.velocity;
        //If the star has moved from the bottom of the screen, spawn it at the top.
        if (star.y > this.height) {
            this.stars[i] = new Star(Math.random() * this.width, 0, _STAR_WIDTH, _STAR_HEIGHT);
        }
    }
};

CoolGame.prototype.draw = function () {

    //Get the drawing context.
    var ctx = this.canvas.getContext("2d");

    //Draw the background.
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = this.stars[1].color;

    for (var i = 0; i < this.stars.length; i++) {
        var star = this.stars[i];
        ctx.drawImage(star.image, star.x, star.y, star.width, star.height);
        //ctx.fillStyle = star.color;
        //ctx.fillStyle = pattern;
        //ctx.fillRect(star.x, star.y, star.width, star.height);
        ctx.moveTo(star.y, star.x);
    }
};

CoolGame.prototype.click = function (x, y) {
    newImg = new Image();
    newImg.src="ball_over.png";
    for (var i = 0; i < this.stars.length; i++) {
        var left = this.stars[i].x;
        var right = this.stars[i].x + this.stars[i].width;
        var top = this.stars[i].y;
        var bottom = this.stars[i].y + this.stars[i].height;
        if (right >= x && left <= x && bottom >= y && top <= y) {
            this.stars[i].image = newImg;
            _STAR_COUNTER++;
            return true;
        }
    }
};

var coolGame = new CoolGame();

var container = document.getElementById('game');
container.addEventListener('click', function (e) {
    coolGame.click(e.offsetX, e.offsetY);
}, false);


coolGame.initialise(container);
coolGame.start();
