var warning = document.getElementById("warning");
warning.style = "display:none;";
var dimX = document.getElementById("dimX");
var dimY = document.getElementById("dimY");
var board = document.getElementById("board");
var mines = document.getElementById("mines");

var boardArray = []

function start () {
    boardArray = [];
    let boardTable = "<table>"
    let ratio = mines.value / (dimX.value * dimY.value);
    for (let x=0; x < dimX.value; x++) {
        boardTable += "<tr>"
        for (let y=0; y < dimY.value; y++) {
            if (Math.random() < ratio) {
                boardArray.push(9);
            } else {
                boardArray.push(0);
            }
            boardTable += "<td class=\"unchecked\" id=" + x + "," + y + " onclick=recieve(" + x + "," + y + ")></td>"
        }
        boardTable += "</tr>"
    }
    boardTable += "</table>"
    board.innerHTML = boardTable;
    for (let x = 0; x < dimX.value; x++) {
        for (let y=0; y<dimY.value; y++) {
            boardArray[y * dimX.value + x] = countMines(x, y);
        }
    }
}

function countMines (x, y) {
    let pos = y * dimX.value + x
    
    if (boardArray[pos] !== 9) {
        let total = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i + j * dimX.value + pos >= 0) {
                    if (boardArray[i + j * dimX.value + pos] === 9) {
                        total++;
                    }
                }
            }
        }
        return total;
    } else {
        return 9;
    }
}

function recieve(x, y) {
    console.log(boardArray[y * dimX.value + x]);
    if (boardArray[y * dimX.value + x] === 9) {
        document.getElementById(x + "," + y).style="background-color: red;";
    }
}