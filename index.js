var warning = document.getElementById("warning");
warning.style = "display:none;";
var dimX = document.getElementById("dimX");
var dimY = document.getElementById("dimY");
var board = document.getElementById("board");
var minedisp = document.getElementById("minedisp");
var difficulty = document.getElementById("difficulty");
var ddisp = document.getElementById("ddisp");

var t = 0;
var md = 0;
const mod = [0, -1, 1, dimX.value, dimX.value - 1, dimX.value + 1, -dimX.value, -dimX.value - 1, -dimX.value + 1]
var boardArray = []
const sleep = ms => new Promise(r => setTimeout(r, ms));

function start () {
    md = 0;
    let cx = dimX.value * dimY.value
    boardArray = [];
    let boardTable = "<table id=\"gameTable\">"
    let ratio = difficulty.value * 0.01;
    for (let y=0; y < dimY.value; y++) {
        boardTable += "<tr>"
        for (let x=0; x < dimX.value; x++) {
            if (Math.random() < ratio) {
                boardArray.push(9);
                md++;
            } else {
                boardArray.push(0);
            }
            boardTable += "<td class=\"unchecked\" id=" + x + "," + y + " onclick=recieve(" + x + "," + y + ") oncontextmenu=\"mark(" + x + "," + y + ");return false;\"></td>"
        }
        boardTable += "</tr>"
    }
    boardTable += "</table>"
    board.innerHTML = boardTable;

    let n;

    minedisp.innerHTML = md;

    n = Math.floor(Math.random() * dimX.value * dimY.value);
    boardArray[n] = 0;
    boardArray[n-1] = 0;
    boardArray[n+1] = 0;
    boardArray[n+dimX.value] = 0;
    boardArray[n-1+dimX.value] = 0;
    boardArray[n+1+dimX.value] = 0;
    boardArray[n-dimX.value] = 0;
    boardArray[n-1-dimX.value] = 0;
    boardArray[n+1-dimX.value] = 0;

    for (let x = 0; x < dimX.value; x++) {
        for (let y=0; y<dimY.value; y++) {
            boardArray[y * dimX.value + x] = countMines(x, y);
        }
    }


    clear(convertnumtoxy(n)[0], convertnumtoxy(n)[1]);
    clearAround(convertnumtoxy(n)[0], convertnumtoxy(n)[1]);

    document.getElementById("gameTable").style="border: 2px solid black;";
}

function countMines (x, y) {
    if (boardArray[y * dimX.value + x] !== 9) {
        let pos = y * dimX.value + x;
        let b = [-1, 1, -1, 1];

        if (y === 0) {
            b[0] = 0;
        }
        if (y === dimY.value - 1) {
            b[1] = 0;
        }
        if (x === 0) {
            b[2] = 0;
        }
        if (x === dimX.value - 1) {
            b[3] = 0
        }
        let total = 0;
        for (let i = b[0]; i <= b[1]; i++) {
            for (let j = b[2]; j <= b[3]; j++) {
                if (boardArray[pos + dimX.value * i + j] === 9) {
                    total++;
                }
            }
        }
        return total;
    } else {
        return 9;
    }
}

async function clearAround(x, y) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (boardArray[convertxytonum(x + i, y + j)] === 0) {
                const element = document.getElementById((x + i) + "," + (y + j));
                if (element && element.classList.contains("unchecked")) {
                    clear(x + i, y + j);
                    await sleep(10);
                    clearAround(x + i, y + j);
                } 
            } else if (boardArray[convertxytonum(x + i, y + j)] !== 9){
                clear(x + i, y + j);
            }
        }
    }
}

function clear(x, y) {
    const element = document.getElementById(x + "," + y);
    if (element) {
        element.classList.add("checked");
        element.classList.remove("unchecked");
        element.innerHTML = "<img src=\"images/tile" + boardArray[y * dimX.value + x] + ".png\">";
    }
}

function convertxytonum (x, y) {
    return y * dimX.value + x;
    
}

function convertnumtoxy (num) {
    return [num % dimX.value, Math.floor(num / dimX.value)]
}

function recieve (x, y) {
    if (!(document.getElementById(x + "," + y).classList.contains("flag"))) {
        document.getElementById(x + "," + y).classList.add("checked");
        document.getElementById(x + "," + y).classList.remove("unchecked");
        document.getElementById(x + "," + y).innerHTML = "<img src=\"images/tile" + boardArray[y * dimX.value + x] + ".png\">";
        let tileType = boardArray[y * dimX.value + x];
        if (tileType === 9) {
            gameEnd();
        } else if (tileType === 0) {
            clearAround(x, y);
        } else {
            let aroundX = [0];
            let aroundY = [0];
            if (x !== 0) {
                aroundX.push(-1);
            }
            if (x !== dimX.value - 1) {
                aroundX.push(1);
            }
            if (y !== 0) {
                aroundY.push(-1);
            }
            if (y !== dimY.value - 1) {
                aroundY.push(1);
            }

            let uncheckedMines = false
            let minesFlagged = 0;
            for (let xMod = 0; xMod < aroundX.length; xMod++) {
                for (let yMod = 0; yMod < aroundY.length; yMod++) {
                    let testCell = document.getElementById((x + aroundX[xMod]) + "," + (y + aroundY[yMod]));
                    if (testCell.classList.contains("flag")) {
                        minesFlagged++;
                    } else if (boardArray[(y + aroundY[yMod]) * dimX.value + (x + aroundX[xMod])] === 9) {
                        uncheckedMines = true;
                    }
                }
            }

            if (minesFlagged === tileType) {
                if (uncheckedMines) {
                    gameEnd();
                } else {
                    clearAround(x, y);
                }
            }
        }
    }
}

function mark (x, y) {
    let tile = document.getElementById(x + "," + y);
    if (tile.classList.contains("unchecked") && !(tile.classList.contains("flag"))) {
        tile.classList.add("flag");
        md -= 1;
        minedisp.innerHTML = md;
        tile.innerHTML = "<img src=\"images/tile10.png\">";
    } else if (tile.classList.contains("unchecked") && tile.classList.contains("flag")) {
        tile.classList.remove("flag");
        tile.innerHTML = "";
        md += 1;
        minedisp.innerHTML = md;
    }
}
function gameEnd () {
    for (let i = 0; i < dimX.value; i++) {
        for (let j = 0; j < dimY.value; j++) {
            clear(i, j);
            document.getElementById("gameTable").style="border: 2px solid red;";
        }
    }
}
function ddispUpdate () {
    if (difficulty.value >= 10) {
        ddisp.innerHTML = difficulty.value;
    } else {
        ddisp.innerHTML = "0" + difficulty.value;
    }
}