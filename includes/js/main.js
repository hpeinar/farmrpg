/* Boomman v0.1
Written by Henrik Peinar
http://projekt406.ee/codeblog
17.12.2012
*/

$(document).ready(function() {

	var shiftDown = false;

	// clicking anywhere will give the canvas focus
	$('body').click(function(e) {
		$('#mainCanvas').focus();
	})

	var game = new gameBoard();

	// we need to queue up all the clicks we get from the client
	$('body').keydown(function(e) {
		// shift key
		if(e.keyCode == 16) {
			e.preventDefault();
			shiftDown = true;
		}

		// shift combinations
		var shiftAllowed = new Array(37, 38, 39, 40);

		if(shiftDown && shiftAllowed.indexOf(e.keyCode) != -1) {
			// we'll add 500 to make the keyCode unique
			game.keyQueue.push(e.keyCode + 500);
		}

		// allowed keys (those actually do something in the game)
		var allowed = new Array(32, 37, 38, 39, 40);
		if(game.keyQueue.indexOf(e.keyCode) == -1 && allowed.indexOf(e.keyCode) != -1 && !shiftDown) {
			game.keyQueue.push(e.keyCode);
		}
	})

	$('body').keyup(function(e) {
		// shift key
		if(e.keyCode == 16) {
			shiftDown = false;
		}

		if(game.keyQueue.indexOf(e.keyCode) != -1) {

			if(e.keyCode != 32) {
				game.keyQueue.splice(game.keyQueue.indexOf(e.keyCode), 1);
			}
		}
	})
	
	game.init(function() {
		game.bind(game, function() {

			setInterval(function() {
				game.update(function() {
					game.draw();
				});
			}, 25);

		})

	})
})

// stop the scrolling!
document.onkeydown = function(evt) {
    evt = evt || window.event;
    var keyCode = evt.keyCode;
};