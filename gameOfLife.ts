export class GameOfLife{

    grid: number[][];
    generation:number = 0;

    constructor (public height:number,public width:number ){
        this.grid = [];
    }

    /**
     * Checks if a cell is alive
     */
    isAlive (x:number):number {
        return x;
    }
    
    incrementGeneration():void{
        this.generation ++;
    }

    /**
     * Calculates the live neighbors of a cell
     * @param i Row index for the cell
     * @param j Column index for the cell
     * @returns the number of live neighbors
     */
    calculateLiveNeighbors(row:number, col:number):number {
        let count=0;
        for(let i=Math.max(0,row-1); i<=Math.min(row+1,this.height-1); i++){
            for (let j=Math.max(0,col-1); j<=Math.min(col+1,this.width-1); j++){
                if (i != row || j != col){
                    if  (this.isAlive(this.grid[i][j])) count++
                }
            }
        } 
        return count;
    }

    /**
     * Calculates next state of the cell according to the Game of Life rules 
     * @param i Row index for the cell
     * @param j Column index for the cell
     */    
    calculateNextCellState(row:number,col:number){
        let liveNeighbors:number = this.calculateLiveNeighbors(row,col);
        let nextCellState:number;
        if (this.isAlive(this.grid[row][col])){
            if (liveNeighbors<2 || liveNeighbors>3) nextCellState = 0;
            else nextCellState = 1;
        }
        else{ //cell is dead
            if (liveNeighbors === 3) nextCellState = 1;
            else nextCellState = 0;
        }
        return nextCellState;
    }

    nextGeneration():number[][]{
        //Calculate next generation to a new array
        this.grid = this.grid.map((row,i) => row.map( (cell,j) => this.calculateNextCellState(i,j)));
        this.incrementGeneration();
        return this.grid;
    }
}
