'use strict';

//this object stores vital information regarding the
// game state, score and difficulty.
var gameState = {
  difficulty: 1,
  currentScore: 0,
  highScore : 0,
  currentState: ""
};

var Enemy = function(x, y) { //the enemy class generator.
  //x Variables applied to each of our instances go here,
  // we've provided one for you to get started
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images

  this.x = x;
  this.y = y;
  this.speed = this.newSpeed();
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.newSpeed =  function() {
  //generates and returns a new speed for an enemy entity.
  return Math.floor(Math.random() * 5 * (gameState.difficulty / 2) + 4);
};

Enemy.prototype.update = function(dt) {
  //reads speed of this enemy instance, adds it to the x position,
  // then multiplies it by dt checks to see if entity has crossed
  // the boundary. if so, sets its position back
  //to the start of the game board, and re-randomises its speed.
  if(this.x > 505) {
    this.x = -150;
    this.speed = this.newSpeed();
  }
  if(dt > 0.3) {
    //pausing or very low framerate can cause the enemy sprites
    //to jitter around. so, if dt is too large a number we
    // set it back to something more reasonable.
    dt = 0.1;
  }
  this.x += this.speed + 60 * dt;

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function() {
  //initial values given to a Player entity.
  this.startx = 202;
  this.starty = 571;
  this.x = this.startx;
  this.y = this.starty;
  //newy and newx are used to make temporary changes to player
  // position, in order to leave rendering of final position
  // to the player.render method.
  this.newx = this.x;
  this.newy = this.y;

  this.sprite = 'images/char-boy.png';
};

Player.prototype.render = function() {
  //does the actual drawing of the updated sprite.
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.update = function() {
  //main game loop calls for the updates to take place then renders the updates
  //onto the canvas. Using newx and current x to diff
  // between what has changed in
  //logic, but making sure the update function does the actual assignation.
  this.x = this.newx;
  this.y = this.newy;
};

Player.prototype.drawScore = function() {
  ctx.fillStyle = 'white';
  ctx.font = '30px sans-serif';
  ctx.fillText('Score: ' + gameState.currentScore, 15, 90);
  ctx.fillStyle = 'white';
  ctx.font = '30px sans-serif';
  ctx.fillText('HighScore: ' + gameState.highScore, 15, 120);
  ctx.fillStyle = 'white';
  ctx.font = '30px sans-serif';
  ctx.fillText('Level: ' + gameState.difficulty, 370, 90);
};

Player.prototype.collisionCheck = function() {
  //converts numbers to whole numbers, checks to see if player entity
  //is within 40px of enemy entity in terms of x,y,
  // triggers playerLose state if true.
  for (var i = 0; i < allEnemies.length; i++) {
    if(Math.abs(player.x - allEnemies[i].x) < 50 &&
      Math.abs(player.y - allEnemies[i].y) < 50) {
      gameState.currentState = 'playerLose';
      //if the player has not collided with an enemy, we check to see if
      // they have reached the water.
    } else if (this.y < 10) {
      gameState.currentState = 'playerWin';
    }
  }
};

Player.prototype.positionReset = function() {
  //resets location of the player.
  this.newy = this.starty;
};

Player.prototype.scoreReset = function() {
  //resets the score to zero.
  gameState.currentScore = 0;
};

Player.prototype.scoreGain = function() {
  //deals with score gain, and manages highscore.
  gameState.currentScore += 50;
  if(gameState.currentScore > gameState.highScore) {
    gameState.highScore = gameState.currentScore;
  }
};

// ===================== KEY INPUTS LISTENERS ============================= //

Player.prototype.handleInput = function(input) {
  //gets called by the event listener. Takes action based on key pressed.

  switch (input) {
    //player positional changes are made by updating the 'newx' and
    //'newy' variables instead of directly modifying the position values.
    case 'left':
      input = 'left';
      if (this.x < 10) {
        return null;
      } else {
        this.newx -= 101;
      }
      break;

    case 'right':
      input = 'right';
      if (this.x > 401) {
        return null;
      } else {
        this.newx += 101;
      }
      break;

    case 'up':
      input = 'up';
      if (this.y < 10) {
        this.newy += 83;
      } else {
        this.newy -= 83;
      }
      break;

    case 'down':
      input = 'down';
      if (this.y > 570) {
        return null;
      } else {
        this.newy += 83;
      }
      break;

    case 'p':
      input = 'p';
      //basic state changes based on the keypress.
      if (gameState.currentState === 'pause') {
        gameState.currentState = 'main';
      } else if (gameState.currentState === 'main') {
        gameState.currentState = 'pause';
      }
      break;
    case 'spacebar':
      input = 'spacebar';
      if (gameState.currentState === 'startScreen') {
        gameState.currentState = 'main';
      } else if(gameState.currentState === 'playerLose') {
        gameState.currentState = 'main';
      }
      break;
  }
};
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    80: 'p',
    32: 'spacebar'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});


//creates enemies and the player entity.

var player = new Player();
var enemy1 = new Enemy(-126, 63);
var enemy2 = new Enemy(-106, 145);
var enemy3 = new Enemy(-96, 478);
var enemy4 = new Enemy(-176, 395);
var enemy5 = new Enemy(-206, 312);
var allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5];