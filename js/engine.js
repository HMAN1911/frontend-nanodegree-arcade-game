/*jshint globalstrict: true*/
/*global gameState */
/*global player */
/*global Resources */
/*global allEnemies */
"use strict";

/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */
var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 750;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */

     function statesman() {
        //this little function hands control over to the part of our program
        //that is supposed to have it at any given time by referring to
        //the gamestate.currentstate value.

        if(gameState.currentState === "pause"){
            pause();
        } else if (gameState.currentState === "main") {
            main();
        } else if (gameState.currentState === "startScreen") {
            startScreen();
        } else if (gameState.currentState === "playerLose") {
            playerLose();
        } else if (gameState.currentState === "playerWin") {
            playerWin();
        }
     }

    function pause() {
        //we always call requestanimationframe and ask it to run the function, otherwise we blow the stack. We
        //want to let the browser handle rendering, this is why we dont call the statesman() function ourselves.
        render();
        ctx.fillStyle = "white";
        ctx.font = '29px sans-serif';
        ctx.fillText("Paused", player.x, player.y + 100);
        win.requestAnimationFrame(statesman);
    }

    function playerWin() {
        player.scoreGain();
        player.positionReset();
        //Render is called once here to make sure the score change is reflected on the screen.
        render();
        //This line increases difficulty level of the game, effectively increasing enemy speeds.
        gameState.difficulty += 1;
        //Just a little visual flavor to help players recognise they won :)
        ctx.drawImage(Resources.get('images/Star.png'), player.x, player.y);
        //once we are done with the winning process, we set the state back to main, and hand control
        //back over to statesman.
        gameState.currentState = "main";
        //Delays rendering for 500ms to prevent player being disoriented.
        setTimeout(statesman, 500);
    }

    function playerLose() {
        render();
        ctx.fillStyle = "white";
        ctx.font = '29px sans-serif';
        ctx.fillText("Splat!", player.x, player.y + 100);
        ctx.fillStyle = "white";
        ctx.font = '39px sans-serif';
        ctx.fillText("Press Space", player.x - 60, player.y + 129);
        gameState.difficulty = 1;
        player.scoreReset();
        player.positionReset();
        win.requestAnimationFrame(statesman);
    }

    function startScreen() {
        //this renders the start screen, then asks the browser to render again when able.
        ctx.drawImage(Resources.get('images/start-screen.png'), 0, 0);
        win.requestAnimationFrame(statesman);
    }

    function main() {

        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */

        var now = Date.now(),
            dt = ((now - lastTime) / 1000.0);

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(statesman);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        //sets the state of the game to be the start screen, then passes control over to statesman.
        gameState.currentState = "startScreen";
        statesman();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
            updateEntities(dt);
            player.collisionCheck();
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        player.update();
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */

        var rowImages = [
                'images/water-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/grass-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/grass-block.png'
            ],
            numRows = 8,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
         //Makes sure the background is always black and doesnt receive bleed
         //from other sprites
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,505,755);

        //draws the sprite tiles and generates the game board.
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
        player.drawScore();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/start-screen.png',
        'images/Star.png'
    ]);
    Resources.onReady(init);
    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;

})(this);
