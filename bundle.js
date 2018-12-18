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
    //Table template with increasing IDs
    $(".gridContainer").append('<div class="col-sm text-center gridCont " id="gridContainer' + gridCounter + '" > <table id="grid' + gridCounter + '" class="grid"></table> <p>Generation: <span id="genCount' + gridCounter + '">0</span> </p> <button id="start' + gridCounter + '">Start</button> <button id="stop' + gridCounter + '">Stop</button> </div>');
    drawHTMLGrid(height, width, "grid" + gridCounter);
    createBtnEventListeners(height, width, gridCounter); //create a closure for gridCounter
    gridCounter++;
});
function createBtnEventListeners(height, width, ID) {
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
    var prevGen = gameOfLife.grid;
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
 * Redraw the HTML table when needed (eg when we change the generation)
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
 * Checks if two 2D-arrays are the same (contain exactly the same items with the same order)
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

},{}]},{},[2,1]);
