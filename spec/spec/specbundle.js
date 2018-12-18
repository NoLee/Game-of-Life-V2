(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gameOfLife_1 = require("./gameOfLife");
var gridCounter = 1; //global counter for grids created
var intervalIDs = []; //global array for intervals
//** FUNCTIONS FOR EVENT LISTENERS
$("#drawGrid").click(function () {
    var height = parseInt(document.getElementById("height").value);
    var width = parseInt(document.getElementById("width").value);
    $(".gridContainer").append('<div class="col-sm text-center gridCont " id="gridContainer' + gridCounter + '" > <table id="grid' + gridCounter + '" class="grid"></table> <p>Generation: <span id="genCount' + gridCounter + '">0</span> </p> <button id="start' + gridCounter + '">Start</button> <button id="stop' + gridCounter + '">Stop</button> </div>');
    drawHTMLGrid(height, width, "grid" + gridCounter);
    createEventListeners(height, width, gridCounter); //create a closure for gridCounter
    gridCounter++;
});
function createEventListeners(height, width, ID) {
    $("#start" + ID).click(function () {
        var gameofLife = new gameOfLife_1.GameOfLife(height, width);
        intervalIDs[ID] = setInterval(function () { nextGeneration(gameofLife, "grid" + ID, "genCount" + ID, ID); }, 500);
    });
    $("#stop" + ID).click(function () {
        clearInterval(intervalIDs[ID]);
    });
}
/**
 * Draw a grid (html table) according to the input values for height and width of user
 */
function drawHTMLGrid(height, width, gridID) {
    var gridHTML = document.getElementById(gridID);
    // Create html table
    for (var i = 0; i < height; i++) {
        var row = gridHTML.insertRow(0);
        for (var j = 0; j < width; j++) {
            var cell = row.insertCell(0);
            cell.innerHTML = "";
        }
    }
    // Onclick a table element, change its class 
    $("#" + gridID + " td").click(function () {
        if (this.className == "")
            this.className = "selected";
        else
            this.className = "";
    });
}
/**
 * Calculate next generation
 */
function nextGeneration(gameOfLife, gridID, generationID, ID) {
    // Get the grid state from HTML and set it to the gameoflife grid instance
    gameOfLife.grid = getHTMLGrid(gridID);
    var prevGen = gameOfLife.grid.slice();
    // Calculate next generation
    var nextGen = gameOfLife.nextGeneration();
    //If we are at the same generation as before (no more evolution), stop Game of life
    if (arraysEqual(nextGen, prevGen))
        clearInterval(intervalIDs[ID]);
    //Redraw HTMl grid
    redrawHTMLGrid(gameOfLife.height, gameOfLife.width, nextGen, gridID);
    $("#" + generationID).html(gameOfLife.generation + "");
}
/**
 * Get the grid state from HTML
 * @returns an array with the grid, cell values are [1] if the cell is selected and [0] if it is not
 */
function getHTMLGrid(gridID) {
    var gridHTML = document.getElementById(gridID);
    var array = [];
    for (var i = 0, row = void 0; row = gridHTML.rows[i]; i++) {
        array[row.rowIndex] = [];
        for (var j = 0, col = void 0; col = row.cells[j]; j++) {
            if (col.className == "selected")
                array[row.rowIndex][col.cellIndex] = 1;
            else
                array[row.rowIndex][col.cellIndex] = 0;
        }
    }
    return array;
}
/**
 * Redraw the HTML table when needed ( eg when we change the generation)
 */
function redrawHTMLGrid(height, width, grid, gridID) {
    var gridHTML = document.getElementById(gridID);
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var cell = gridHTML.rows[i].cells[j];
            if (grid[i][j])
                cell.className = "selected";
            else
                cell.className = "";
        }
    }
}
/**
 * Checks if two 2Darrays are the same (contain exactly the same items with the same order)
 * @param a First array
 * @param b Second array
 */
function arraysEqual(a, b) {
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    if (a.length != b.length)
        return false;
    for (var i = 0; i < a.length; i++) {
        if (a[i].length != b[i].length)
            return false;
        for (var j = 0; j < a[i].length; j++) {
            if (a[i][j] !== b[i][j])
                return false;
        }
    }
    // alert("test");
    return true;
}
exports.arraysEqual = arraysEqual;

},{"./gameOfLife":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameOfLife = /** @class */ (function () {
    function GameOfLife(height, width) {
        this.height = height;
        this.width = width;
        this.generation = 0;
        this.grid = [];
    }
    /**
     * Checks if a cell is alive
     */
    GameOfLife.prototype.isAlive = function (x) {
        return x;
    };
    /**
     * Increments generation counter
     */
    GameOfLife.prototype.incrementGeneration = function () {
        this.generation++;
    };
    /**
     * Calculates the live neighbors of a cell
     * @param i Row index for the cell
     * @param j Column index for the cell
     * @returns the number of live neighbors
     */
    GameOfLife.prototype.calculateLiveNeighbors = function (row, col) {
        var count = 0;
        for (var i = Math.max(0, row - 1); i <= Math.min(row + 1, this.height - 1); i++) {
            for (var j = Math.max(0, col - 1); j <= Math.min(col + 1, this.width - 1); j++) {
                if (i != row || j != col) {
                    if (this.isAlive(this.grid[i][j]))
                        count++;
                }
            }
        }
        return count;
    };
    /**
     * Calculates next state of the cell according to the Game of Life rules
     * @param i Row index for the cell
     * @param j Column index for the cell
     */
    GameOfLife.prototype.calculateNextCellState = function (row, col) {
        var liveNeighbors = this.calculateLiveNeighbors(row, col);
        var nextCellState;
        if (this.isAlive(this.grid[row][col])) {
            if (liveNeighbors < 2 || liveNeighbors > 3)
                nextCellState = 0;
            else
                nextCellState = 1;
        }
        else { //cell is dead
            if (liveNeighbors === 3)
                nextCellState = 1;
            else
                nextCellState = 0;
        }
        return nextCellState;
    };
    /**
     * Calculate next generation and replace the grid with the new one
     */
    GameOfLife.prototype.nextGeneration = function () {
        var _this = this;
        this.grid = this.grid.map(function (row, i) { return row.map(function (cell, j) { return _this.calculateNextCellState(i, j); }); });
        this.incrementGeneration();
        return this.grid;
    };
    return GameOfLife;
}());
exports.GameOfLife = GameOfLife;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gameOfLife_1 = require("../../gameOfLife");
var UI_1 = require("../../UI");
describe("Game of life class has a function that", function () {
    var testArray = [[0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 1, 0, 0],
        [1, 0, 0, 0, 1],
        [0, 0, 0, 0, 1]];
    var game = new gameOfLife_1.GameOfLife(5, 5);
    game.grid = testArray;
    beforeEach(function () {
    });
    it("calculates the alive neighbors of a cell (calculateLiveNeighbors)", function () {
        expect(game.calculateLiveNeighbors(1, 1)).toEqual(2);
        expect(game.calculateLiveNeighbors(1, 3)).toEqual(1);
        expect(game.calculateLiveNeighbors(1, 2)).toEqual(4);
        expect(game.calculateLiveNeighbors(0, 0)).toEqual(1); //edge case for the upper left corner of table
        expect(game.calculateLiveNeighbors(0, 4)).toEqual(1); //edge case for the upper right corner of table
        expect(game.calculateLiveNeighbors(4, 0)).toEqual(1); //edge case for the lower left corner of table
        expect(game.calculateLiveNeighbors(4, 4)).toEqual(1); //edge case for the lower right corner of table
        expect(game.calculateLiveNeighbors(1, 4)).toEqual(1); //edge case for right border
        expect(game.calculateLiveNeighbors(2, 4)).toEqual(2); //edge case for right border
    });
    it('calculates next cell state according to its neighbors (calculateNextCellState)', function () {
        //test live cells
        expect(game.calculateNextCellState(1, 3)).toEqual(0); //1 neighbors        
        expect(game.calculateNextCellState(1, 1)).toEqual(1); //2 neighbors
        expect(game.calculateNextCellState(2, 1)).toEqual(1); //3 neighbors
        expect(game.calculateNextCellState(1, 2)).toEqual(0); //4 neighbors
        //test dead cells
        expect(game.calculateNextCellState(3, 1)).toEqual(1); //dead -> alive
        expect(game.calculateNextCellState(0, 0)).toEqual(0); //dead -> dead
    });
});
describe("Game of life class has a function that", function () {
    var testArray = [[0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 1, 0, 0],
        [1, 0, 0, 0, 1],
        [0, 0, 0, 0, 1]];
    var game = new gameOfLife_1.GameOfLife(5, 5);
    game.grid = testArray;
    it('greates the next generation array', function () {
        var nextGen = [[0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0],
            [1, 1, 1, 1, 0],
            [0, 1, 0, 1, 0],
            [0, 0, 0, 0, 0]];
        expect(game.nextGeneration()).toEqual(nextGen);
    });
});
describe("arraysEqual", function () {
    it('checks if two arrays are equal', function () {
        var a = [[1, 2, 3, 4, 5, 6], [1, 2]];
        var b = [[1, 2, 3, 4, 5, 6], [1, 2]];
        var c = [[1, 2, 3, 4, 6, 7], [1, 2]];
        expect(UI_1.arraysEqual(a, b)).toBe(true);
        expect(UI_1.arraysEqual(a, c)).toBe(false);
    });
});

},{"../../UI":1,"../../gameOfLife":2}]},{},[3]);
