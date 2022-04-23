/* Boomman v0.1
Written by Henrik Peinar
http://projekt406.ee/codeblog
17.12.2012
*/

class Tile {
	constructor() {
		this.identifier = 0;
		this.X = 1;
		this.Y = 1;
		this.sprite = null;
		this.isWalkable = true;
		this.drawItem = false; // used on non-walkable tiles to draw items
		this.isDestructable = false;
		this.isBorder = false;
		this.isDeadly = false;
		this.hasItem = null;
		this.item = null;
		this.hasBomb = null;
	}

	breakWall(tile, color, time) {
		setTimeout(function() {
			tile.color = color;
			tile.isWalkable = true;
			tile.isDeadly = false;
			tile.sprite = 'GRASS';
		}, time);
	}
	draw(board, canvas) {

		if(this.sprite != 'GRASS') {
			var s = new sprite();
			s.draw(this.sprite, board, canvas, this.X, this.Y);
		}
		
		// draw the item if it's seeable
		if((this.hasItem == true && this.isWalkable == true) || this.drawItem == true) {
			this.item.draw(board, canvas);
		}
		//context.fillStyle = "#999999":
		//context.fillRect(X, Y, config.tileSize, config.tileSize);
	};
	drawLighting(board, canvas) {
		var s = new sprite();
		s.draw('lighting', board, canvas, this.X, this.Y, null, 0.001);
	}
}