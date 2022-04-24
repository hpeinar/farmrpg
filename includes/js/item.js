/* Boomman v0.1
Written by Henrik Peinar
http://projekt406.ee/codeblog
17.12.2012
*/

const ITEM_HOE = 11;

class Item {
	constructor()
	{
		this.X = 0;
		this.Y = 0;
		this.color = '#3a9dc2';
		this.type = 0; // item type for use inside the system
		this.name = ''; // name for reference
		this.sprite = null;

		this.rotation = 0;
		this.animation = false;
		this.animationSpeed = 2;
	}
	draw(board, canvas) {

		if(this.animation) {
			this.rotation += this.animationSpeed;
		}
		var s = new Sprite();
		s.draw(this.sprite, board, canvas, this.X, this.Y, this.rotation);
	}
}