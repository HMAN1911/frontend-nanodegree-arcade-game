## Synopsis

Frogger Game clone, developed for Udacity's Front End Web Developer course **Project 3**.

## How to Play

Click [here](http://hman1911.github.io/frontend-nanodegree-arcade-game/ "Frogger") to play right now.

Alternatively, execute index.html to run the game. See how high a score you can reach!

### How to Win

Reach the cool blue waters at the top edge of the screen to win! Enemies get faster each time
you reach the water.

### Controls

Spacebar: Start the game from the main menu.

P: Pause the game. Press again to resume.

Up, down, left right: Move the character in respective directions.

### Todo

1. The state handler is currently very primitive. Transitional states can be implemented so that 'run once' code does not need to be re-run several times. An example of this can be found in the playerLose function on line 94 of engine.js:

```javascript
function playerLose() {
    render();
    ctx.fillStyle = 'white';
    ctx.font = '29px sans-serif';
    ctx.fillText('Splat!', player.x, player.y + 100);
    ctx.fillStyle = 'white';
    ctx.font = '39px sans-serif';
    ctx.fillText('Press Space', player.x - 60, player.y + 129);
    gameState.difficulty = 1;
    player.scoreReset();
    player.positionReset();
    win.requestAnimationFrame(statesman);
  }
  ```