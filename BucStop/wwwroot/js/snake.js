/* 
* Snake
* 
* Base game created by straker on GitHub
*  https://gist.github.com/straker/81b59eecf70da93af396f963596dfdc5
* 
* Implemented by Kyle Wittman
* 
* Fall 2023, ETSU
* 
*/

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

//const textArea = document.getElementById('textArea');

// the canvas width & height, snake x & y, and the apple x & y, all need to be a multiples of the pixelsPerTile size in order for collision detection to work
// (e.g. 16 * 25 = 400)
const pixelsPerTile = 16;
const numTilesWide = canvas.width / pixelsPerTile;
const numTilesHigh = canvas.height / pixelsPerTile;
var frameCounter = 0;

// Structure for holding data for the snake
var snake = {
	x: 160,
	y: 160,
	dx: pixelsPerTile, // snake velocity. moves one pixelsPerTile length every frame in either the x or y direction
	dy: 0,
	cells: [], // keep track of all grids the snake body occupies
	maxCells: 4 // length of the snake. grows when eating an apple
};

// Structure for holding data for the current apple
var apple = {
	x: getRandomInt(0, numTilesWide) * pixelsPerTile,
	y: getRandomInt(0, numTilesHigh) * pixelsPerTile
};

var score = 0
context.font = '12px arial'

// get random whole numbers in a specific range
// see https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

// game loop
function loop() {
	requestAnimationFrame(loop);

	// slow game loop to 15 fps instead of 60 (60/15 = 4)
	if (++frameCounter < 4) {
		return;
	}

	frameCounter = 0; // Reset the FPS counter
	context.clearRect(0, 0, canvas.width, canvas.height);

	// display the current score
	context.fillStyle = 'gray'
	context.fillText(`Score: ${score}`, 5, 20)

	// move snake by it's velocity
	snake.x += snake.dx;
	snake.y += snake.dy;

	// wrap snake position horizontally on edge of screen
	if (snake.x < 0) { // Left side of the screen
		snake.x = canvas.width - pixelsPerTile;
	}
	else if (snake.x >= canvas.width) { // Right side of the screen
		snake.x = 0;
	}

	// wrap snake position vertically on edge of screen
	if (snake.y < 0) { // Top of the screen
		snake.y = canvas.height - pixelsPerTile;
	}
	else if (snake.y >= canvas.height) { // Bottom of the screen
		snake.y = 0;
	}

	// keep track of where snake has been. front of the array is always the head
	snake.cells.unshift({x: snake.x, y: snake.y});

	// remove cells as we move away from them
	if (snake.cells.length > snake.maxCells) {
		snake.cells.pop();
	}

	// draw apple
	context.fillStyle = 'red';
	context.fillRect(apple.x, apple.y, pixelsPerTile-1, pixelsPerTile-1);

	// draw snake one cell at a time
	context.fillStyle = 'green';
	snake.cells.forEach(function(cell, index) {

		// drawing 1 px smaller than the pixelsPerTile creates a pixelsPerTile effect in the snake body so you can see how long it is
		context.fillRect(cell.x, cell.y, pixelsPerTile-1, pixelsPerTile-1);

		// snake ate apple
		if (cell.x === apple.x && cell.y === apple.y) {
			snake.maxCells++;
			score++;

			// canvas is 400x400 which is 25x25 grids
			apple.x = getRandomInt(0, numTilesWide) * pixelsPerTile;
			apple.y = getRandomInt(0, numTilesHigh) * pixelsPerTile;
		}

		// check collision with all cells after this one (modified bubble sort)
		for (var i = index + 1; i < snake.cells.length; i++) {

			// snake occupies same space as a body part. reset game
			if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
				score = 0;
				snake.x = 160;
				snake.y = 160;
				snake.cells = [];
				snake.maxCells = 4;
				snake.dx = pixelsPerTile;
				snake.dy = 0;

				apple.x = getRandomInt(0, 25) * pixelsPerTile;
				apple.y = getRandomInt(0, 25) * pixelsPerTile;
			}
		}
	});
}

// listen to keyboard events to move the snake
document.addEventListener('keydown', function(e) {
	// prevent snake from backtracking on itself by checking that it's
	// not already moving on the same axis (pressing left while moving
	// left won't do anything, and pressing right while moving left
	// shouldn't let you collide with your own body)

	// left arrow key
	if (e.which === 37 && snake.dx === 0) {
		snake.dx = -pixelsPerTile;
		snake.dy = 0;
	}
	// up arrow key
	else if (e.which === 38 && snake.dy === 0) {
		snake.dy = -pixelsPerTile;
		snake.dx = 0;
	}
	// right arrow key
	else if (e.which === 39 && snake.dx === 0) {
		snake.dx = pixelsPerTile;
		snake.dy = 0;
	}
	// down arrow key
	else if (e.which === 40 && snake.dy === 0) {
		snake.dy = pixelsPerTile;
		snake.dx = 0;
	}
});

// start the game
requestAnimationFrame(loop);