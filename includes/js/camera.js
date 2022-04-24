/* Boomman v0.1
Written by Henrik Peinar
http://projekt406.ee/codeblog
13.01.2013
*/

class Camera {
	constructor (x, y, width, height) {
		this.X = x;
		this.Y = y;
		this.width = width;
		this.height = height;
	}
	move (board, moveX, moveY) {

		// move camera tile by tile, not by some wierd amount
		moveX *= config.tileSize / 4;
		moveY *= config.tileSize / 4;

		if(this.X + moveX >= 0 && (this.X + moveX + this.width) <= (board.xTiles * config.tileSize)) {
			this.X += moveX;
		}

		if(this.Y + moveY >= 0 && (this.Y + moveY + this.height) <= (board.yTiles * config.tileSize)) {
			this.Y += moveY;
		}
	}
}