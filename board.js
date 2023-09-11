class Board {
	constructor(ctx, ctxNext) {
		this.ctx = ctx;
		this.ctxNext = ctxNext;
		this._init();
	}

	_init() {
		this.ctx.canvas.width = COLS * BLOCK_SIZE;
		this.ctx.canvas.height = ROWS * BLOCK_SIZE;

		this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
	}

	_initBoard() {
		return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
	}

	reset() {
		this.grid = this._initBoard();
		this.tetromino = new Tetromino(this.ctx);
		this.tetromino.setStartingPosition();
		this.ghost = new Tetromino(this.ctx, this.tetromino);
	}

	getNewPiece() {
		const { width, height } = this.ctxNext.canvas;
		this.next = new Tetromino(this.ctxNext);
		this.ctxNext.clearRect(0, 0, width, height);
		this.next.draw();
	}

	draw() {
		this.tetromino.draw();
		this.drawBoard();
	}

	drawBoard() {
		this.board.forEach((row, y) => {
			row.forEach((val, x) => {
				if (value > 0) {
					this.ctx.fillStyle = COLORS[val];
					this.ctx.fillRect(x, y, 1, 1);
				}
			});
		});
	}

	transpose(t) {
		for (let y = 0; y < t.shape.length; y++) {
			for (let x = 0; x < y; x++) {
				[t.shape[x][y], t.shape[y][x]] = [t.shape[y][x], t.shape[x][y]];
			}
		}
	}

	rotate(tetromino) {
		const t = JSON.parse(JSON.stringify(tetromino));

		this.transpose(t);

		t.shape.forEach((row) => row.reverse());

		return t;
	}

	reverseRotate(tetromino) {
		const t = JSON.parse(JSON.stringify(tetromino));

		t.shape.forEach((row) => row.reverse());

		this.transpose(t);

		return t;
	}

	valid(t) {
		return t.shape.every((row, y) => {
			return row.every((value, x) => {
				return (
					value === 0 ||
					(this.isInsideWalls(t.x + x, t.y + y) &&
						this.isNotOccupied(t.x + x, t.y + y))
				);
			});
		});
	}

	isNotOccupied(x, y) {
		return this.board[y] && this.board[y][x] === 0;
	}

	isInsideWalls(x, y) {
		return x >= 0 && x < COLS && y < ROWS;
	}

	freeze() {
		this.tetromino.shape.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value > 0) {
					this.board[y + this.tetromino.y][x + this.tetromino.x] = value;
				}
			});
		});
	}

	drop() {
		let tetromino = moves[KEY.DOWN](this.tetromino);

		if (this.valid(tetromino)) {
			this.tetromino.move(tetromino);
		} else {
			this.freeze();
			this.clearLines();
			if (this.tetromino.y === 0) {
				return false;
			}
			this.tetromino = this.next;
			this.tetromino.ctx = this.ctx;
			this.tetromino.setStartingPosition();
			this.ghost = new Tetromino(this.ctx, this.tetromino);
			this.getNewPiece();
		}

		return true;
	}

	clearLines() {
		let lines = 0;

		this.board.forEach((row, y) => {
			if (row.every((val) => val > 0)) {
				lines++;
				this.board.splice(y, 1);

				this.grid.unshift(Array(COLS).fill(0));
			}
		});

		// add line and score logic
	}
}
