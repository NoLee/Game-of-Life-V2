import { GameOfLife } from "./gameOfLife";

var gridCounter=1; // global counter for grids created
var intervalIDs:number[] = []; // global array for intervals

//** FUNCTIONS FOR EVENT LISTENERS
$("#drawGrid").click( function (){
    let height = parseInt((<HTMLInputElement>document.getElementById("height")).value);
    let width = parseInt((<HTMLInputElement>document.getElementById("width")).value);
    
    //Table template with increasing IDs
    $(".gridContainer").append('<div class="col-sm text-center gridCont " id="gridContainer'+gridCounter+'" > <table id="grid'+gridCounter+
        '"class="grid"></table> <p>Generation: <span id="genCount'+gridCounter+'">0</span> </p> '+
        '<button id="start'+gridCounter+'">Start</button> '+
        '<button id="stop'+gridCounter+'" class="hidden">Stop</button>'+
        '<button id="resume'+gridCounter+'" class="hidden">Resume</button> '+
        '<button id="clear'+gridCounter+'">Clear</button>'+
        '<button id="delete'+gridCounter+'">Delete Grid</button> </div>');
    drawHTMLGrid(height, width, "grid"+gridCounter);  
    createBtnEventListeners(height,width,gridCounter); // create a closure for gridCounter
    gridCounter++;
})

function createBtnEventListeners(height:number,width:number,ID:number){
    $("#start" + ID).click(function() {
        $("#stop"+ID).toggle();
        $("#start"+ID).toggle();
        let gameofLife = new GameOfLife(height, width);    
        intervalIDs[ID] = setInterval(function(){ nextGeneration(gameofLife,"grid"+ID,"genCount"+ID, ID) }, 500);
        createResumeListener(gameofLife); // resume btn must know the gameoflife Obgject
        removeEventListenerTD("grid"+ID); // user cannot click on grid
    })

    $("#stop"+ID).click(function() {
        $("#stop"+ID).toggle();
        $("#resume"+ID).toggle();
        clearInterval(intervalIDs[ID]);
        createEventListenerTD("grid"+ID);
    })

    $("#clear"+ID).click(function() {
        let emptyGrid = initArray(height,width);
        clearInterval(intervalIDs[ID]);
        redrawHTMLGrid(height,width,emptyGrid,"grid"+ID);
        if ($("#stop"+ID).is(":visible")) createEventListenerTD("grid"+ID); // if "clean" btn is pressed when the game is running, stop the game and allow user to click on grid
        $("#stop"+ID).hide();
        $("#start"+ID).show();
        $("#resume"+ID).hide();
        
    })

    $("#delete"+ID).click(function() {
        $("#gridContainer"+ID).hide();
        clearInterval(intervalIDs[ID]);
    })

    function createResumeListener(gameofLife:GameOfLife) {
        //remove event listener if it has one
        $("#resume"+ID).off("click");

        $("#resume"+ID).click(function() {
            $("#stop"+ID).toggle();
            $("#resume"+ID).toggle();

            //resume gameoflife 
            intervalIDs[ID] = setInterval(function(){ nextGeneration(gameofLife,"grid"+ID,"genCount"+ID, ID) }, 500);

            removeEventListenerTD("grid"+ID);
        })
    }
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

    createEventListenerTD(gridID);
}

/**
 * Onclick a table element, change its class 
 */ 
function createEventListenerTD(gridID:string) {
    $("#"+gridID+" td").click(function(){
        if (this.className == "") this.className = "selected";
        else this.className = "";
    });
};

function removeEventListenerTD(gridID:string) {
    $("#"+gridID+" td").off("click");
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
    if (arraysEqual(nextGen,prevGen)) {
        clearInterval(intervalIDs[ID]);
        $("#stop"+ID).hide();
        $("#start"+ID).show();
        $("#resume"+ID).hide();
        createEventListenerTD("grid"+ID);
        // return false;
    } 

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

/**
 * Initialize 2d array with zeros
 * @param h height of array (lines)
 * @param w width of array (columns)
 */
function initArray(h:number,w:number) {
    let array:number[][] =[];
    for (let i = 0; i < h; i++) {
        array[i]=[];
        for (let j=0; j<w; j++) {            
            array[i][j]=0;
        }      
    }
    return array;
}