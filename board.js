class Board {
	constructor(ctx, ctxNext, ctxHold) {
		this.ctx = ctx;
		this.ctxNext = ctxNext;
		this.ctxHold = ctxHold;
		this.holdPiece = null;
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
		this.board = this._initBoard();
		this.tetromino = new Tetromino(this.ctx);
		this.tetromino.setStartingPosition();
		this.ghost = new Tetromino(this.ctx, this.tetromino);
		this.getNewPiece();
	}

	getNewPiece() {
		const { width, height } = this.ctxNext.canvas;
		this.next = new Tetromino(this.ctxNext);
		this.ctxNext.clearRect(0, 0, width, height);
		this.next.draw();
	}

	drawBoard() {
		this.board.forEach((row, y) => {
			row.forEach((val, x) => {
				if (val > 0) {
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

		this.ghost.shape = t.shape;
		return t;
	}

	reverseRotate(tetromino) {
		const t = JSON.parse(JSON.stringify(tetromino));

		t.shape.forEach((row) => row.reverse());

		this.transpose(t);

		this.ghost.shape = t.shape;
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
			hold = true;
		}

		return true;
	}

	hold() {
		const { width, height } = this.ctxHold.canvas;
		this.ctxHold.clearRect(0, 0, width, height);

		if (!this.holdPiece) {
			this.holdPiece = this.tetromino;
			this.holdPiece.x = 0
			this.holdPiece.y = 0
			this.holdPiece.shape = SHAPES[this.holdPiece.typeId]
			this.holdPiece.ctx = this.ctxHold;
			this.tetromino = this.next;
			this.tetromino.ctx = this.ctx;
			this.tetromino.setStartingPosition();
			this.ghost = new Tetromino(this.ctx, this.tetromino);
			this.getNewPiece();
		}	else {
			let temp = this.holdPiece;
			this.holdPiece = this.tetromino;
			this.holdPiece.x = 0
			this.holdPiece.y = 0
			this.holdPiece.shape = SHAPES[this.holdPiece.typeId]
			this.holdPiece.ctx = this.ctxHold;
			this.tetromino = temp
			this.tetromino.ctx = this.ctx
			this.tetromino.setStartingPosition();
			this.ghost = new Tetromino(this.ctx, this.tetromino);
		}

		this.holdPiece.draw()
	}

	clearLines() {
		let lines = 0;

		this.board.forEach((row, y) => {
			if (row.every((val) => val > 0)) {
				lines++;
				this.board.splice(y, 1);

				this.board.unshift(Array(COLS).fill(0));
			}
		});

		if (lines > 0) {
			account.score += this.getLineClearPoints(lines);
			account.lines += lines;

			console.log(this.getLineClearPoints(lines));
			if (account.lines >= LINES_PER_LEVEL) {
				account.level++;

				account.lines -= LINES_PER_LEVEL;

				time.level = LEVEL[account.level];
			}
		}
	}

	getLineClearPoints(lines) {
		const lineClearPoints =
			lines === 1
				? POINTS.SINGLE
				: lines === 2
				? POINTS.DOUBLE
				: lines === 3
				? POINTS.TRIPLE
				: lines === 4
				? POINTS.TETRIS
				: 0;

		return (account.level + 1) * lineClearPoints;
	}
}
