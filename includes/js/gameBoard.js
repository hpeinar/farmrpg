/* Boomman v0.1
Written by Henrik Peinar
http://projekt406.ee/codeblog
17.12.2012
*/

function gameBoard() {
	this.tiles = new Array();
	this.bombs = new Array();
	this.keyQueue = new Array();
	this.floatingTexts = new Array();
	this.player = null;
	this.canvas = null;
	this.backgroundCanvas = null;
	this.uiCanvas = null;
	this.panel = null;
	this.lastKeysDown = null;
	this.camera = null;

	// move timer
	this.isMoving = false;
	this.movingTimer = 0;
	this.moveX = 0;
	this.moveY = 0;

	// board options
	this.xTiles = 60;
	this.yTiles = 60;

	this.bind = function(board, cb) {
		board.canvas.keydown(function(e) {
			board.keyDownCode = e.keyCode;
		});

		board.canvas.keyup(function(e) {
			board.keyDownCode = null;
			board.keyUpCode = e.keyCode;
		});

		console.log("Gameboard binding");
		cb();
	};
	this.getTile = function(board, xPos, yPos, cb) {
		var selectedTile = null;
		for(var tile in board.tiles) {
			var currentTile = board.tiles[tile];
			if(currentTile.X == xPos && currentTile.Y == yPos) {
				selectedTile = currentTile;
			}
		}

		cb(selectedTile);
	}
	this.backgroundCanvasInit = function() {
		this.backgroundCanvas.attr('width', config.canvasWidth);
		this.backgroundCanvas.attr('height', config.canvasHeight);
	};

	this.UICanvasInit = function() {
		this.uiCanvas.attr('width', config.canvasWidth);
		this.uiCanvas.attr('height', config.canvasHeight);
	};
	this.init = function(cb) {
		// select the game board, put it into the right size
		this.canvas = $('#mainCanvas');
		this.backgroundCanvas = $('#backgroundCanvas');
		this.uiCanvas = $('#uiCanvas');

		// init backgroundCanvas
		this.backgroundCanvasInit();

		// init uiCanvas
		this.UICanvasInit();

		// init camera
		this.camera = new camera(0, 0, config.canvasWidth, config.canvasHeight);

		// to not use width() or height() methods here, it'll screw the canvas up
		this.canvas.attr('width', config.canvasWidth);
		this.canvas.attr('height', config.canvasHeight);

		this.canvas.focus();

		// set the scale to 1, 1 to avoid any 
		this.canvas.scaleCanvas({
		  scaleX: 1, scaleY: 1
		})

		console.log('Gameboard initilization');

		// generate map
		//var tile = new tile();
		var axeSpawned = false;

		for(var i = 0;i < this.xTiles;i++) {

			for(var e = 0;e < this.yTiles;e++) {

				var newTile = new tile();
				newTile.X = i * config.tileSize;
				newTile.Y = e * config.tileSize;
				newTile.identifier = i + (e*i);
				newTile.sprite = 'GRASS';

				// for every tile, draw a backgroun	d grass layer
				// draw it right here because we'll never change it
				var s = new sprite();
				s.draw('GRASS', this, this.backgroundCanvas, newTile.X, newTile.Y);


				var random = Math.floor(Math.random() * 10);

				if(i == 0 || e == 0 || i ==  (this.xTiles - 1)|| e == (this.yTiles - 1)) {
					// paint walls
					newTile.isBorder = true;
					newTile.isWalkable = false;
					newTile.sprite = 'TREE_UNBREAKABLE';
					this.tiles.push(newTile);
				} else if(random == 5) {
					// some random walls
					newTile.isWalkable = false;
					newTile.isDestructable = true;
					newTile.sprite = 'TREE';

					this.tiles.push(newTile);

				} else if(random == 7 && !axeSpawned) {
					//spawn an axe
					// some walls have items inside them
					var newItem = new item();
					newTile.isWalkable = true;
					newItem.X = newTile.X;
					newItem.Y = newTile.Y;
					newItem.type = 10;
					newItem.name = 'Axe';
					newItem.sprite = 'AXE';
					newItem.animation = false;

					newTile.hasItem = true;
					newTile.item = newItem;
					this.tiles.push(newTile);

					axeSpawned = true;
				}
			}
		}

		function roughSizeOfObject( object ) {

	    var objectList = [];
	    var stack = [ object ];
	    var bytes = 0;

	    while ( stack.length ) {
	        var value = stack.pop();

	        if ( typeof value === 'boolean' ) {
	            bytes += 4;
	        }
	        else if ( typeof value === 'string' ) {
	            bytes += value.length * 2;
	        }
	        else if ( typeof value === 'number' ) {
	            bytes += 8;
	        }
	        else if
	        (
	            typeof value === 'object'
	            && objectList.indexOf( value ) === -1
	        )
	        {
	            objectList.push( value );

	            for( i in value ) {
	                stack.push( value[ i ] );
	            }
	        }
	    }
	    return bytes;
	}


		// add player
		var newPlayer = new player();
		this.player = newPlayer;
		this.player.randomSpawn(this);
		
		var infoPanel = new panel();
		this.panel = infoPanel;

		console.log(this.canvas.getLayers());

		cb();
	};
	 
	this.update = function(cb) {
		this.player.tilesOn = new Array();

		var playerX = this.player.X;
		var playerY = this.player.Y;

		var playerFarX = playerX + (config.tileSize - 1);
		var playerFarY = playerY + (config.tileSize - 1);

		for(var tile in this.tiles) {
			var currentTile = this.tiles[tile];
			
			if((playerX >= currentTile.X
				&& playerY >= currentTile.Y
				&& playerY <= (currentTile.Y + (config.tileSize - 1))
				&& playerX <= (currentTile.X + (config.tileSize - 1)))
				||
				(playerFarX >= currentTile.X
				&& playerFarY >= currentTile.Y
				&& playerFarY <= (currentTile.Y + (config.tileSize - 1))
				&& playerFarX <= (currentTile.X + (config.tileSize - 1))) 
				||
				(playerFarX >= currentTile.X
				&& playerY >= currentTile.Y
				&& playerY <= (currentTile.Y + (config.tileSize - 1))
				&& playerFarX <= (currentTile.X + (config.tileSize - 1)))
				||
				(playerX >= currentTile.X
				&& playerFarY >= currentTile.Y
				&& playerFarY <= (currentTile.Y + (config.tileSize - 1))
				&& playerX <= (currentTile.X + (config.tileSize - 1))))	{

				// add this to player on Tiles
				this.player.tilesOn.push(currentTile);
			}
		}

		if(!this.isMoving && this.player.isWorking != true) {
			this.moveX = 0;
			this.moveY = 0;
		
			// handle the keys pressed
			for(var key in this.keyQueue) {
					var keyDownCode = this.keyQueue[key];

					// shift combinations
					if(keyDownCode == 539) {
						this.player.sprite = "PLAYER_RIGHT";
						this.keyQueue.splice(this.keyQueue.indexOf(539), 1);
					}

					if(keyDownCode == 538) {
						this.player.sprite = "PLAYER_UP";
						this.keyQueue.splice(this.keyQueue.indexOf(538), 1);
					}

					if(keyDownCode == 537) {
						this.player.sprite = "PLAYER_LEFT";
						this.keyQueue.splice(this.keyQueue.indexOf(537), 1);
					}

					if(keyDownCode == 540) {
						this.player.sprite = "PLAYER_DOWN";
						this.keyQueue.splice(this.keyQueue.indexOf(540), 1);
					}

					if(!this.isMoving) {
						if(keyDownCode == 39) {

							this.moveX = this.player.speed;
							this.player.sprite = "PLAYER_RIGHT";

							this.isMoving = true;
							this.movingTimer = 4;
						}
					}

					if(!this.isMoving) {
						if(keyDownCode == 38) {

							this.moveY = this.player.speed * -1;
							this.player.sprite = "PLAYER_UP";

							this.isMoving = true;
							this.movingTimer = 4;
						}
					}

					if(!this.isMoving) {
						if(keyDownCode == 37) {

							this.moveX = this.player.speed * -1;
							this.player.sprite = "PLAYER_LEFT";

							this.isMoving = true;
							this.movingTimer = 4;
						}
					}

					if(!this.isMoving) {
						if(keyDownCode == 40) {

							this.moveY = this.player.speed;
							this.player.sprite = "PLAYER_DOWN";

							this.isMoving = true;
							this.movingTimer = 4;
						}
					}


					if(keyDownCode == 32) { 
						// get the tile next to the player
						console.log(this.player.X + config.tileSize, this.player.Y);

						var board = this;

						// check if player has axe equipped
						console.log(this.player);
						if(this.player.equippedItem && this.player.equippedItem.type == 10) {

							var checkX;
							var checkY;

							if(board.player.sprite == "PLAYER_DOWN") {
								checkX = this.player.X;
								checkY = this.player.Y + config.tileSize;
							}
							if(board.player.sprite == "PLAYER_UP") {
								checkX = this.player.X;
								checkY = this.player.Y - config.tileSize;
							}
							if(board.player.sprite == "PLAYER_LEFT") {
								checkX = this.player.X - config.tileSize;
								checkY = this.player.Y;
							}
							if(board.player.sprite == "PLAYER_RIGHT") {
								checkX = this.player.X + config.tileSize;
								checkY = this.player.Y;
							}

							this.getTile(this, checkX, checkY, function(tile) {

								console.log("Tile:"+ tile);
								
								if(tile && tile.sprite == 'TREE') {
									var newItem = new item();
									newItem.X = tile.X;
									newItem.Y = tile.Y;
									newItem.type = 10;
									newItem.name = 'Axe';
									newItem.sprite = 'AXE';
									newItem.animation = true;

									tile.hasItem = true;
									tile.item = newItem;
									tile.drawItem = true;

									board.player.isWorking = true;

									setTimeout(function() { 
										board.player.isWorking = false; 

										var newItem = new item();
										newItem.X = tile.X;
										newItem.Y = tile.Y;
										newItem.type = 11;
										newItem.name = 'Closed chest';
										newItem.sprite = 'CHEST_CLOSED';
										newItem.animation = false;

										tile.hasItem = true;
										tile.item = newItem;
										tile.drawItem = false;
										tile.isWalkable = true;
										tile.sprite = 'GRASS';

									}, 3000);
								} 
							

							});
						} else {
							var floater = new floatingText();
							floater.text = 'Missing a tree or an axe';
							floater.X = this.player.X - this.camera.X;
							floater.Y = this.player.Y- this.camera.Y;
							this.floatingTexts.push(floater);
						}

						this.keyQueue.splice(this.keyQueue.indexOf(32), 1);
					}

						

					// flush keyQueue
					//board.keyQueue.splice(board.keyQueue.indexOf(32), 1);
					//this.keyQueue = new Array();
						
			}



			if(this.isMoving == true) {
				this.player.move(this, this.moveX / 4, this.moveY / 4);
			}

		} else {
			this.movingTimer--;
			if(this.movingTimer == 0) {
				this.isMoving = false;
			}
			if(this.isMoving == true) {
				this.player.move(this, this.moveX / 4, this.moveY / 4);
			}
			
		}


		cb();
	};

	this.selectTile = function(xPos, yPos, cb) {
		for(var tile in this.tiles) {
			if(this.tiles[tile].X == xPos && this.tiles[tile].Y == yPos) {
				cb(this.tiles[tile]);
			}
		}
	};
	this.draw = function() {

		var start = new Date().getTime();
		// clear canvas
		this.canvas.clearCanvas();

		// panel
		//this.panel.draw(this);

		// tiles
		for(var tile in this.tiles) {
			this.tiles[tile].draw(this, this.canvas);
		}

		// bombs
		for(var bomb in this.bombs) {
			this.bombs[bomb].draw(this, this.canvas);
		}

		// player
		this.player.draw(this, this.canvas);

		// floating texts
		for(var floatingText in this.floatingTexts) {
			this.floatingTexts[floatingText].draw(this, this.canvas);
		}

		var end = new Date().getTime();
		var time = end - start;
		//console.log('Execution time: ' + time);
	};
}