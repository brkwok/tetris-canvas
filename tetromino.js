class Tetromino {
	constructor(ctx, tetromino = null) {
		this.ctx = ctx;
		this.spawn(tetromino);
	}

	spawn(tetromino = null) {
		this.typeId = tetromino ? tetromino.typeId : this.randomize(COLORS.length - 1);
		this.shape = tetromino ? tetromino.shape : SHAPES[this.typeId];
		this.color = tetromino ? tetromino.color + "80" : COLORS[this.typeId];
		this.x = tetromino ? tetromino.x : 0;
		this.y = tetromino ? tetromino.y : 0;
		this.hardDropped = false;
	}

	draw() {
		this.ctx.fillStyle = this.color;
		this.shape.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value > 0) {
					this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
				}
			});
		});
	}

	move(tetromino) {
		if (!this.hardDropped) {
			this.x = tetromino.x;
			this.y = tetromino.y;
		}
		this.shape = tetromino.shape;
	}

	hardDrop() {
		this.hardDropped = true;
	}

	setStartingPosition() {
		this.x = this.typeId === 4 ? 4 : 3;
	}

	// Make a different randomize function
	randomize(size) {
		return Math.floor(Math.random() * size + 1);
	}
}
