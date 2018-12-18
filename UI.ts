import { GameOfLife } from "./gameOfLife";

var height:number;
var width:number;
var globalInterval: any;

//** FUNCTIONS FOR EVENT LISTENERS
$("#drawGrid").click( function (){
    height = parseInt((<HTMLInputElement>document.getElementById("height")).value);
    width = parseInt((<HTMLInputElement>document.getElementById("width")).value);
    $("#gridContainer").show();
    drawHTMLGrid(height, width, "grid");  
})

$("#start").click(function() {
    let gameofLife = new GameOfLife(height, width);    
    globalInterval = setInterval(function(){ nextGeneration(gameofLife) }, 500);
})

$("#stop").click(function() {
    clearInterval(globalInterval);
})


/**
 * Calculate next generation
 */ 
function nextGeneration(gameOfLife: GameOfLife){
    // Get the grid state from HTML and set it to the gameoflife grid instance
    gameOfLife.grid = getHTMLGrid(gameOfLife);
    // Calculate next generation
    let nextGen = gameOfLife.nextGeneration();
    //Redraw HTMl grid
    redrawHTMLGrid(nextGen, "grid");
    $("#genCount").html(gameOfLife.generation + "");
}

/**
 * Redraw the HTML table when needed ( eg when we change the generation)
 */
function redrawHTMLGrid(grid:number[][], gridID:string){
    let gridHTML = <HTMLTableElement>document.getElementById(gridID);

    for (let i=0; i<height; i++){
        for (let j=0; j<width; j++){
            let cell = gridHTML.rows[i].cells[j];
            if (grid[i][j]) cell.className = "selected";
            else cell.className = "";            
        }
    }
}

/**
 * Draw a grid (html table) according to the input values for height and width of user
 */
function drawHTMLGrid(height:number, width:number, gridID:string ): void{
    let gridHTML = <HTMLTableElement>document.getElementById(gridID);
    
    // Clear previous table and stop game of life algorithm
    gridHTML.innerHTML = "";
    clearInterval(globalInterval);

    // Create html table
    for(let i=0; i<height; i++){
        let row = gridHTML.insertRow(0);
        for(let j=0; j<width; j++){
            let cell= row.insertCell(0);
            cell.innerHTML = "";
        }
    }
    
    // Onclick a table element, change its class 
    $(".grid td").click(function(){
        if (this.className == "") this.className = "selected";
        else this.className = "";
    });
}

/**
 * Get the grid state from HTML
 * @returns an array with the grid, cell values are [1] if the cell is selected and [0] if it is not
 */
function getHTMLGrid(gameofLife:GameOfLife): number[][] {
    let gridHTML = <HTMLTableElement>document.getElementById("grid");
    let array: number[][] = [];

    for (let i = 0, row; row = gridHTML.rows[i]; i++) {
        array[row.rowIndex] = [];
        for (let j = 0, col; col = row.cells[j]; j++) {
            if(col.className == "selected") array[row.rowIndex][col.cellIndex] = 1;
            else array[row.rowIndex][col.cellIndex] = 0;
        }  
     }
     return array;
}