const KEY = {
	LEFT: 37,
	RIGHT: 38,
	UP: 39,
	DOWN: 40,
	Z: 90,
};

Object.freeze(KEY);

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);