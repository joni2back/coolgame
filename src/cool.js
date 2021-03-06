/**
 * @author Jonas Sciangula Street <joni2back@gmail.com>
 */

Math.fromto = function (from, to) {
    return Math.floor(Math.random() * to) + from;
};

Image.create =  function(src) {
    var img = new Image();
    img.src = src;
    return img;
};

var CoolGame = function() {
    this.fps = 60;
    this.canvas = null;
    this.width = 0;
    this.height = 0;
    this.minVelocity = 60;
    this.maxVelocity = 150;
    this.balls = 15;
    this.intervalId = 0;
    this.clickedBalls = 0;
    this.background = '#000';
    this.audio = 'click.wav';
    this.imgBall = 'ball.png';
    this.imgBallOver = 'ball.png';
};

var Ball = function(image, x, y, width, height, velocity) {
    this.image = Image.create(image);
    this.width = width || 124;
    this.height = height || 146;
    this.x = x;
    this.y = y || -this.height;
    this.velocity = velocity || Math.fromto(70,100);
    this.alive = true;
    this.direction = Math.fromto(0, 3);
};

CoolGame.prototype.init = function (div) {
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
    };

    //Create the canvas.
    var canvas = document.createElement('canvas');
    div.appendChild(canvas);
    this.canvas = canvas;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    canvas.addEventListener('mousemove', function (e) {
        xpos = (typeof e.offsetX == 'undefined') ? e.layerX : e.offsetX;
        ypos = (typeof e.offsetY == 'undefined') ? e.layerY : e.offsetY;
        self.touch(xpos, ypos);
    }, false);
};

CoolGame.prototype.start = function () {
    //Create the balls.
    var balls = [];
    for (var i = 0; i < this.balls; i++) {
        balls[i] = new Ball(
            this.imgBall,
            Math.random() * this.width,
            Math.random() * this.height,
            null, null,
            Math.fromto(this.minVelocity, this.maxVelocity)
        );
    }
    this.balls = balls;
    this.resume();
};

CoolGame.prototype.pause = function () {
    clearInterval(this.intervalId);
};

CoolGame.prototype.resume = function () {
    var self = this;
    this.intervalId = setInterval(function () {
        self.update();
        self.draw();
    }, 1000 / this.fps);
};

CoolGame.prototype.update = function () {
    var dt = 1 / this.fps;
    var self = this;
    this.walk(function(ball, i) {
        //Generate ball vertical moviment
        ball.y += dt * ball.velocity;

        ball.direction ?
            ball.x += dt * ball.velocity * -0.2:
            ball.x += dt * ball.velocity * 0.2;

        //If the ball has moved from the bottom of the screen, spawn it at the top.
        if (ball.y > self.height) {
            self.balls[i] = new Ball(
                self.imgBall,
                Math.random() * self.width,
                null, null, null,
                Math.fromto(self.minVelocity, self.maxVelocity)
            );
        }
    });
};

CoolGame.prototype.draw = function () {
    var ctx = this.canvas.getContext("2d");

    //Draw the background.
    ctx.fillStyle = this.background;
    ctx.fillRect(0, 0, this.width, this.height);

    var self = this;
    this.walk(function(ball) {
        self.drawBall(ball, ctx);
    });
};

CoolGame.prototype.drawBall = function (ball, ctx) {
    ////boxes
    //ctx.fillStyle = '#ccc';
    //ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
    //ctx.moveTo(ball.y, ball.x);

    ////circles
    //ctx.beginPath();
    //ctx.arc(ball.x, ball.y, ball.width /2, 159, 2 * Math.PI, false);
    //ctx.fillStyle = 'red';
    //ctx.fill();
    //ctx.moveTo(ball.y, ball.x);

    //images
    ctx.drawImage(ball.image, ball.x, ball.y, ball.width, ball.height);
    ctx.moveTo(ball.y, ball.x);
};

CoolGame.prototype.ballTouch = function (ball, i) {
    if (ball.alive) {
        new Audio(this.audio).play();
        ball.alive = false;
        ball.image.src = this.imgBallOver;
        ball.velocity = ball.velocity * -1;
        this.clickedBalls++;

        //this.balls.splice(i, 1);
        this.balls.push(new Ball(
            this.imgBall,
            Math.random() * self.width,
            null, null, null,
            Math.fromto(this.minVelocity, this.maxVelocity)
        ));
    }
};

CoolGame.prototype.walk = function (callback) {
    if (typeof callback === 'function') {
        for (var i = 0; i < this.balls.length; i++) {
            callback.apply(null, [this.balls[i], i]);
        }
    }
};

CoolGame.prototype.touch = function (x, y) {
    var self = this;
    this.walk(function(ball, i) {
        var left = ball.x;
        var right = ball.x + ball.width;
        var top = ball.y;
        var bottom = ball.y + ball.height;
        if (right >= x && left <= x && bottom >= y && top <= y) {
            self.ballTouch(ball, i);
            return true;
        }
    });
};