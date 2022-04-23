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

	const allowed_shift_keys = [config.key_left, config.key_up, config.key_right, config.key_down];
	const allowed_keys = [config.key_use, config.key_left, config.key_up, config.key_right, config.key_down];

	// we need to queue up all the clicks we get from the client
	$('body').keydown(function(e) {
		// shift key
		if(e.keyCode === config.key_shift) {
			e.preventDefault();
			shiftDown = true;
		}

		// shift combinations

		if(shiftDown && allowed_shift_keys.indexOf(e.keyCode) != -1) {
			// we'll add 500 to make the keyCode unique
			game.keyQueue.push(e.keyCode + 500);
		}

		// allowed keys (those actually do something in the game)

		if(game.keyQueue.indexOf(e.keyCode) == -1 && allowed_keys.indexOf(e.keyCode) != -1 && !shiftDown) {
			game.keyQueue.unshift(e.keyCode);
		}
	})

	$('body').keyup(function(e) {
		// shift key
		if(e.keyCode === config.key_shift) {
			shiftDown = false;
		}

		if(game.keyQueue.indexOf(e.keyCode) != -1) {

			if(e.keyCode !== config.key_use) {
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