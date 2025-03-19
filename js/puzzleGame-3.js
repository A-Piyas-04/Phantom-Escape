var rows = 5;
var columns = 5;

var currTile;
var otherTile;

var turns = 0;

window.onload = function() {
    //initialize the 5x5 board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.src = "../Match Tiles Puzzle/images/blank.jpg";

            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            document.getElementById("board").append(tile);
        }
    }

    //pieces
    let pieces = [];
    for (let i=1; i <= rows*columns; i++) {
        pieces.push(i.toString());
    }
    pieces.reverse();
    for (let i =0; i < pieces.length; i++) {
        let j = Math.floor(Math.random() * pieces.length);

        //swap
        let tmp = pieces[i];
        pieces[i] = pieces[j];
        pieces[j] = tmp;
    }

    for (let i = 0; i < pieces.length; i++) {
        let tile = document.createElement("img");
        tile.src = "../Match Tiles Puzzle/images/" + pieces[i] + ".jpg";

        //DRAG FUNCTIONALITY
        tile.addEventListener("dragstart", dragStart);
        tile.addEventListener("dragover", dragOver);
        tile.addEventListener("dragenter", dragEnter);
        tile.addEventListener("dragleave", dragLeave);
        tile.addEventListener("drop", dragDrop);
        tile.addEventListener("dragend", dragEnd);

        document.getElementById("pieces").append(tile);
    }

    document.getElementById("submit-button").addEventListener("click", checkPuzzle);
}

//DRAG TILES
function dragStart() {
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {
}

function dragDrop() {
    otherTile = this;
}

function dragEnd() {
    if (currTile.src.includes("blank")) {
        return;
    }
    let currImg = currTile.src;
    let otherImg = otherTile.src;
    currTile.src = otherImg;
    otherTile.src = currImg;

    turns += 1;
    document.getElementById("turns").innerText = turns;
}

function checkPuzzle() {
    const boardTiles = document.getElementById("board").getElementsByTagName("img");
    let isCorrect = true;

    for (let i = 0; i < boardTiles.length; i++) {
        const expectedNumber = (i + 1).toString();
        const currentTileSrc = boardTiles[i].src;
        
        if (!currentTileSrc.includes(expectedNumber + ".jpg")) {
            isCorrect = false;
            break;
        }
    }

    if (isCorrect) {
        alert("Memory Matrix Override Complete! Access Granted.");
        // Here you can add code to handle room completion and progression
    } else {
        alert("Pattern Mismatch Detected. Try Again.");
    }
}