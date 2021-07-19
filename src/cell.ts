import { Board } from "./board";
import { CellType } from "./enums/cellType";

export class Cell {
	public type: CellType;
	public readonly x: number;
	public readonly y: number;
	public number: number = 0;
	private readonly board: Board;
	public wasPath: boolean = false;

	constructor(type: CellType, x: number, y: number, board: Board) {
		this.type = type;
		this.x = x;
		this.y = y;
		this.board = board;
		if(type == CellType.PATH) this.wasPath = true;
	}

	public getNeighbors() : Array<Cell> {
		const result: Array<Cell> = new Array<Cell>();

		if(this.x > 0) result.push(this.board.grid[this.x - 1][this.y]);
		if(this.x < this.board.grid.length - 1) result.push(this.board.grid[this.x + 1][this.y]);
		if(this.y > 0) result.push(this.board.grid[this.x][this.y - 1]);
		if(this.y < this.board.grid[0].length - 1) result.push(this.board.grid[this.x][this.y + 1]);

		return result;
	}
}