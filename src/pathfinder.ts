import { Board } from "./board";
import { Cell } from "./cell";
import { CellType } from "./enums/cellType";

export class Pathfinder {
	private board: Board;

	constructor(board: Board) {
		this.board = board;
	}

	public map(renderProgress: boolean) : boolean {
		if(!this.board.findCells(cell => cell.type == CellType.START).length || !this.board.findCells(cell => cell.type == CellType.FINISH).length) return false;
		this.board.forEachCell(cell => cell.number = 0);
		this.board.render();

		let current: Array<Cell> = [this.board.findCells(cell => cell.type == CellType.START)[0]];
		let queue: Array<Cell> = new Array<Cell>();

		const start = Date.now();
		while(!queue.find(cell => cell.type == CellType.FINISH) && current.length) {
			queue = new Array<Cell>();
			current.forEach(cell => {
				const filtered: Array<Cell> = cell.getNeighbors().filter(n => n.number == 0 && ![CellType.START, CellType.WALL].includes(n.type));

				filtered.forEach(f => {
					f.number = cell.number + 1;
					if(renderProgress) this.board.renderCell(f.x, f.y);
					queue.push(f);
				});
			});
			current = Object.assign([], queue);
		}
		if(!current.length) {
			this.board.forEachCell(cell => cell.number = 0);
			this.board.render();
			return false;
		}

		const end = Date.now();

		console.log(`Found finish in: ${(end - start) / 1000} seconds`);

		if(!renderProgress) this.board.render();
		return true;
	}

	public path(renderProgress: boolean) : boolean {
		if(!this.board.findCells(cell => cell.type == CellType.START).length || !this.board.findCells(cell => cell.type == CellType.FINISH).length) return false;
		this.board.forEachCell(cell => {
			if(cell.type == CellType.PATH) cell.type = CellType.AIR;
		});
		this.board.render();

		let currentCell: Cell = this.board.findCells(cell => cell.type == CellType.FINISH)[0];

		while(currentCell.type != CellType.START) {
			const next = currentCell.getNeighbors().filter(n => n.type == CellType.START || (n.type == CellType.AIR && n.number > 0)).sort((a, b) => a.number - b.number)[0];
			if(!next) return false;

			if(next.type == CellType.START) {
				if(renderProgress) {
					this.board.renderCell(next.x, next.y);
					return true;
				}
				currentCell = next;
			} else {
				next.type = CellType.PATH;
				if(renderProgress) this.board.renderCell(next.x, next.y);
				currentCell = next;
			}
		}

		if(!renderProgress) this.board.render();
		return true;
	}
}