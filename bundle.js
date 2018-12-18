(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gameOfLife_1 = require("./gameOfLife");
var height;
var width;
var globalInterval;
//** FUNCTIONS FOR EVENT LISTENERS
$("#drawGrid").click(function () {
    height = parseInt(document.getElementById("height").value);
    width = parseInt(document.getElementById("width").value);
    $("#gridContainer").show();
    drawHTMLGrid(height, width, "grid");
});
$("#start").click(function () {
    var gameofLife = new gameOfLife_1.GameOfLife(height, width);
    globalInterval = setInterval(function () { nextGeneration(gameofLife); }, 500);
});
$("#stop").click(function () {
    clearInterval(globalInterval);
});
/**
 * Calculate next generation
 */
function nextGeneration(gameOfLife) {
    // Get the grid state from HTML and set it to the gameoflife grid instance
    gameOfLife.grid = getHTMLGrid(gameOfLife);
    // Calculate next generation
    var nextGen = gameOfLife.nextGeneration();
    //Redraw HTMl grid
    redrawHTMLGrid(nextGen, "grid");
    $("#genCount").html(gameOfLife.generation + "");
}
/**
 * Redraw the HTML table when needed ( eg when we change the generation)
 */
function redrawHTMLGrid(grid, gridID) {
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
 * Draw a grid (html table) according to the input values for height and width of user
 */
function drawHTMLGrid(height, width, gridID) {
    var gridHTML = document.getElementById(gridID);
    // Clear previous table and stop game of life algorithm
    gridHTML.innerHTML = "";
    clearInterval(globalInterval);
    // Create html table
    for (var i = 0; i < height; i++) {
        var row = gridHTML.insertRow(0);
        for (var j = 0; j < width; j++) {
            var cell = row.insertCell(0);
            cell.innerHTML = "";
        }
    }
    // Onclick a table element, change its class 
    $(".grid td").click(function () {
        if (this.className == "")
            this.className = "selected";
        else
            this.className = "";
    });
}
/**
 * Get the grid state from HTML
 * @returns an array with the grid, cell values are [1] if the cell is selected and [0] if it is not
 */
function getHTMLGrid(gameofLife) {
    var gridHTML = document.getElementById("grid");
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
    GameOfLife.prototype.nextGeneration = function () {
        var _this = this;
        //Calculate next generation to a new array
        this.grid = this.grid.map(function (row, i) { return row.map(function (cell, j) { return _this.calculateNextCellState(i, j); }); });
        this.incrementGeneration();
        return this.grid;
    };
    return GameOfLife;
}());
exports.GameOfLife = GameOfLife;

},{}]},{},[2,1]);
