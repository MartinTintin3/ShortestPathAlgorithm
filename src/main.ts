import { Board } from "./board";
import { CellType } from "./enums/cellType";
import { Pathfinder } from "./pathfinder";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

ctx.translate(0.5, 0.5);

const board = new Board(ctx, 20);
const pathfinder = new Pathfinder(board);
let mousedown = -1;
board.render();

document.getElementById("clear-walls-btn").onclick = () => {
	board.findAndReplace(cell => cell.type == CellType.WALL && !cell.wasPath, CellType.AIR);
	board.findAndReplace(cell => cell.type == CellType.WALL && cell.wasPath, CellType.PATH);
	board.render();
};

document.getElementById("clear-path-btn").onclick = () => {
	board.findAndReplace(cell => cell.type == CellType.PATH, CellType.AIR);
	board.forEachCell(cell => cell.wasPath = false);
	board.render();
};

document.getElementById("force-render-btn").onclick = () => board.render();

document.getElementById("find-path-btn").onclick = () => {
	if(!pathfinder.map(true, true)) return alert("Could not find a path(Mapping)");
	if(!pathfinder.path(true)) alert("Could not find a path(Pathing)");
};

document.getElementById("show-calculations-checkbox").onclick = e => {
	if((e.target as HTMLInputElement).checked) pathfinder.map(false, false);
	board.render();
};

document.getElementById("cell-count").oninput = e => {
	const range: HTMLInputElement = e.target as HTMLInputElement;

	document.getElementById("cell-count-span").innerText = `${range.value}x${range.value}`;
};

document.getElementById("cell-count").onchange = e => {
	const range: HTMLInputElement = e.target as HTMLInputElement;

	board.reset(ctx, canvas.width / parseInt(range.value as unknown as string));
};

canvas.addEventListener("contextmenu", e => e.preventDefault());

class CleanMouseEvent {
	public readonly button: number;
	public readonly clientX: number;
	public readonly clientY: number;

	constructor(button: number, clientX: number, clientY: number) {
		this.button = button;
		this.clientX = clientX;
		this.clientY = clientY;
	}
}

window.onmouseup = () => {
	mousedown = -1;
};
window.onmousedown = e => {
	mousedown = e.button;
	handleMouseEvent(new CleanMouseEvent(mousedown, e.clientX, e.clientY));
};

window.onmousemove = e => {
	if(mousedown >= 0) handleMouseEvent(new CleanMouseEvent(mousedown, e.clientX, e.clientY));
};

const handleMouseEvent = (e: CleanMouseEvent) => {
	const x = e.clientX - canvas.getBoundingClientRect().x;
	const y = e.clientY - canvas.getBoundingClientRect().y;

	if(x <= 0 || y <= 0 || x > canvas.width || y > canvas.height) return;

	const cellX = Math.floor(x / board.getCellLength());
	const cellY = Math.floor(y / board.getCellLength());

	if(board.grid[cellX][cellY] == undefined) console.log("invalid location");

	/* eslint-disable indent */
	switch(e.button) {
		case 0:
			if([CellType.START, CellType.FINISH, CellType.WALL].includes(board.grid[cellX][cellY].type)) break;
			if(board.grid[cellX][cellY].type == CellType.PATH) board.grid[cellX][cellY].wasPath = true;
			board.grid[cellX][cellY].type = CellType.WALL;
			break;
		case 2:
			if(board.grid[cellX][cellY].type != CellType.WALL) break;
			board.grid[cellX][cellY].type = board.grid[cellX][cellY].wasPath ? CellType.PATH : CellType.AIR;
			break;
		default:
			return;
	}
	/* eslint-enable indent */
	board.renderCell(cellX, cellY);
};

document.getElementById("export-btn").onclick = () => {
	const textarea: HTMLTextAreaElement = document.getElementById("export-textarea") as HTMLTextAreaElement;
	textarea.hidden = false;
	textarea.value = board.export();
	textarea.select();
};

(document.getElementById("export-textarea") as HTMLTextAreaElement).addEventListener("focusout", () => {
	(document.getElementById("export-textarea") as HTMLTextAreaElement).hidden = true;
});


document.getElementById("import-btn").onclick = () => {
	const data = prompt("Paste your board data here(Use the export button to get the board data):");
	if(data) {
		if(!board.import(data)) alert("Invalid data. Either there are invalid characters or there are multiple starts/finishes");
	}
};