class Tetromino {
	constructor(ctx) {
		this.ctx = ctx;
		this.color = "blue";

		const typeId = this.randomize(COLORS.length);
		this.shape = SHAPES[typeId];
		this.color = COLORS[typeId];

		this.x = 3;
		this.y = 0;
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
		this.x = tetromino.x;
		this.y = tetromino.y;
		this.shape = tetromino.shape;
	}

	// Make a different randomize function
	randomize(size) {
		return Math.floor(Math.random() * size);
	}
}
