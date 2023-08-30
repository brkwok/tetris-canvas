class Board {
	constructor(ctx) {
		this.ctx = ctx;
		this.board = this.initBoard();
		this.tetromino = new Tetromino(ctx);
	}

	initBoard() {
		return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
	}
}
