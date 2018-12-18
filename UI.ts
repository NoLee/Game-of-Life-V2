import { GameOfLife } from "./gameOfLife";

var gridCounter=1; //global counter for grids created
var intervalIDs:number[] = []; //global array for intervals

//** FUNCTIONS FOR EVENT LISTENERS
$("#drawGrid").click( function (){
    let height = parseInt((<HTMLInputElement>document.getElementById("height")).value);
    let width = parseInt((<HTMLInputElement>document.getElementById("width")).value);
    
    //Table template with increasing IDs
    $(".gridContainer").append('<div class="col-sm text-center gridCont " id="gridContainer'+gridCounter+'" > <table id="grid'+gridCounter+'" class="grid"></table> <p>Generation: <span id="genCount'+gridCounter+'">0</span> </p> <button id="start'+gridCounter+'">Start</button> <button id="stop'+gridCounter+'">Stop</button> </div>');
    drawHTMLGrid(height, width, "grid"+gridCounter);  
    createBtnEventListeners(height,width,gridCounter); //create a closure for gridCounter
    gridCounter++;
})

function createBtnEventListeners(height:number,width:number,ID:number){
    $("#start" + ID).click(function() {
        let gameofLife = new GameOfLife(height, width);    
        intervalIDs[ID] = setInterval(function(){ nextGeneration(gameofLife,"grid"+ID,"genCount"+ID, ID) }, 500);
    })

    $("#stop"+ID).click(function() {
        clearInterval(intervalIDs[ID]);
    })
}

/**
 * Draw a grid (html table) according to the input values for height and width of user
 */
function drawHTMLGrid(height:number, width:number, gridID:string ): void{
    let gridHTML = <HTMLTableElement>document.getElementById(gridID);

    // Create html table
    for(let i=0; i<height; i++){
        let row = gridHTML.insertRow(0);
        for(let j=0; j<width; j++){
            let cell= row.insertCell(0);
            cell.innerHTML = "";
        }
    }
    
    // Onclick a table element, change its class 
    $("#"+gridID+" td").click(function(){
        if (this.className == "") this.className = "selected";
        else this.className = "";
    });
}

/**
 * Calculates and redraws next generation
 */ 
function nextGeneration(gameOfLife: GameOfLife, gridID:string, generationID:string, ID:number){
    // Get the grid state from HTML and set it to the gameoflife grid instance
    gameOfLife.grid = getHTMLGrid(gridID);
    let prevGen = gameOfLife.grid;
    // Calculate next generation
    let nextGen = gameOfLife.nextGeneration();

    //If we are at the same generation as before (no more evolution), stop Game of life
    if (arraysEqual(nextGen,prevGen)) clearInterval(intervalIDs[ID]);

    //Redraw HTMl grid
    redrawHTMLGrid(gameOfLife.height, gameOfLife.width, nextGen, gridID);
    $("#"+generationID).html(gameOfLife.generation + "");
}

/**
 * Get the grid state from HTML
 * @returns an array with the grid, cell values are [1] if the cell is selected and [0] if it is not
 */
function getHTMLGrid(gridID:string): number[][] {
    let gridHTML = <HTMLTableElement>document.getElementById(gridID);
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

/**
 * Redraw the HTML table when needed (eg when we change the generation)
 */
function redrawHTMLGrid(height:number, width:number, grid:number[][], gridID:string){
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
 * Checks if two 2D-arrays are the same (contain exactly the same items with the same order)
 * @param a First array
 * @param b Second array
 */
export function arraysEqual(a:number[][], b:number[][]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i].length != b[i].length) return false;
        for (let j=0; j<a[i].length; j++) {            
            if (a[i][j] !== b[i][j]) return false;
        }      
    }
    return true;
  }