
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
    this.stars = 20;
    this.intervalId = 0;
}

function Star(x, y, width, height, velocity, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = 444;
    this.color = '#fff';
}

//        The main function - initialises the coolGame.
CoolGame.prototype.initialise = function(div) {
        var self = this;

        //        Store the div.
        this.containerDiv = div;
        self.width = window.innerWidth;
        self.height = window.innerHeight;

        window.onresize = function(event) {
                self.width = window.innerWidth;
                self.height = window.innerHeight;
                self.canvas.width = self.width;
                self.canvas.height = self.height;
                self.draw();
         }

        //        Create the canvas.
        var canvas = document.createElement('canvas');
        div.appendChild(canvas);
        this.canvas = canvas;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
};

CoolGame.prototype.start = function() {

        //        Create the stars.
        var stars = [];
        for(var i=0; i<this.stars; i++) {
            stars[i] = new Star(Math.random() * this.width, Math.random()*this.height, _STAR_WIDTH, _STAR_HEIGHT);
        }
        this.stars = stars;

        var self = this;
        //        Start the timer.
        this.intervalId = setInterval(function() {
                self.update();
                self.draw();
        }, 1000 / this.fps);
};

CoolGame.prototype.stop = function() {
        clearInterval(this.intervalId);
};

CoolGame.prototype.update = function() {
        var dt = 1 / this.fps;

        for(var i=0; i<this.stars.length; i++) {
                var star = this.stars[i];
                star.y += dt * star.velocity;
                //        If the star has moved from the bottom of the screen, spawn it at the top.
                if(star.y > this.height) {
                    this.stars[i] = new Star(Math.random() * this.width, 0, _STAR_WIDTH, _STAR_HEIGHT);
                }
        }
};

CoolGame.prototype.draw = function() {

        //        Get the drawing context.
        var ctx = this.canvas.getContext("2d");


        //var ghost = new Image();
        //ghost.src = 'http://www.klopfenstein.net/public/Uploads/lorenz/sad_pacman_ghost.png';
        //var pattern = ctx.createPattern(ghost, 'repeat');

        //        Draw the background.
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.fillStyle = this.stars[1].color;
        img = new Image();
        img.src="ball.png";
        for(var i=0; i<this.stars.length;i++) {
                var star = this.stars[i];
                ctx.drawImage(img,star.x, star.y, star.width, star.height);
                //ctx.fillStyle = star.color;
                //ctx.fillStyle = pattern;
                //ctx.fillRect(star.x, star.y, star.width, star.height);
                ctx.moveTo(star.y, star.x);
        }
};

function randColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}





var container = document.getElementById('game');





var coolGame = new CoolGame();
coolGame.initialise(container);
coolGame.start();


function collides(stars, x, y) {
    var isCollision = false;
    for (var i = 0, len = stars.length; i < len; i++) {

        var left = stars[i].x, right = stars[i].x + stars[i].width;
        var top = stars[i].y, bottom = stars[i].y + stars[i].height;

        if (right >= x && left <= x
            && bottom >= y && top <= y) {
            //isCollision = stars[i];

            stars[i].color = '#ff00ff';
            _STAR_COUNTER++;
            document.getElementById('counter').innerHTML = 'Clicked stars: ' + _STAR_COUNTER;
            return true;
        }
    }
    return isCollision;
}


container.addEventListener('click', function(e) {
    var rect = collides(coolGame.stars, e.offsetX, e.offsetY);
    if (rect) {
        console.log('collision: ' + rect.x + '/' + rect.y);
    }
}, false);








function randomise() {
    coolGame.stop();
    coolGame.stars = Math.random()*1000 + 50;
    coolGame.minVelocity = Math.random()*30+5;
    coolGame.maxVelocity = Math.random()*50 + coolGame.minVelocity;
    coolGame.start();
}

