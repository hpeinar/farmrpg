/* Boomman v0.1
Written by Henrik Peinar
http://projekt406.ee/codeblog
17.12.2012
*/

// predefined sprites, NAME = [yRow, xPos]
var sprites = {};

sprites['GRASS'] = [1, 1];
sprites['TREE_UNBREAKABLE'] =  [1, 2];
sprites['TREE'] = [1, 3];

sprites['PLAYER_DOWN'] = [3, 1];
sprites['PLAYER_LEFT'] = [3, 2];
sprites['PLAYER_RIGHT'] = [3, 3];
sprites['PLAYER_UP'] = [3, 4];

// items
sprites['AXE'] = [2, 1];
sprites['CHEST_CLOSED'] = [2, 2];

class Sprite {
	constructor()
	{
		this.sheet = 'includes/images/' + config.spriteSheet;
		this.tileSize = config.tileSize;
	}
	// draws a sprite to given location
	draw (spriteName, board, canvas, drawX, drawY, rotation, opacity) {
		// see if the sprite fits into camera view
		if(drawX < board.camera.X || drawX > board.camera.X + board.camera.width) {
			return;
		}

		if(drawY < board.camera.Y || drawY > board.camera.Y + board.camera.height) {
			return;
		}

		if(!rotation) {
			rotation = 0;
		}

		if(!opacity) {
			opacity = 1;
		}

		drawX -= board.camera.X;
		drawY -= board.camera.Y;

		// get sprite
		if(spriteName in sprites) {
			var drawable = sprites[spriteName];	

			canvas.drawImage({
				source: this.sheet,

				sx: (drawable[1] * config.tileSize) - config.tileSize,
				sy: (drawable[0] * config.tileSize) - config.tileSize,

				x: drawX,
				y: drawY,

				rotate: rotation,

				sWidth: config.tileSize,
				sHeight: config.tileSize,

				width: config.tileSize,
				height: config.tileSize,

				fromCenter: false,
				cropFromCenter: false
			})
		} else if(spriteName == 'lighting') { 
			canvas.drawRect({
				x: drawX,
				y: drawY,
				fillStyle: '#000',

				width: config.tileSize,
				height: config.tileSize,

				opacity: opacity,

				fromCenter: false
			});
		} else {
			canvas.drawRect({
				x: drawX, 
				y: drawY, 
				fillStyle: '#990000',

				strokeStyle: '#000000',
				strokeWidth: 1, 
				cornerRadius: 0,

				width: config.tileSize, 
				height: config.tileSize,

				fromCenter: false
			})
		}
	}
}