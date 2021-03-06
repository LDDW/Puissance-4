const playerTeam = document.getElementById('player-turn');
let playerTurnTeam = "...";
playerTeam.innerHTML = playerTurnTeam;

let ROWS = 6;
let COLUMNS = 7;
let pseudoJoueur = [""];

document.getElementById('confirmForm').addEventListener('click', () => {
    let selectTheme = document.getElementById('selectTheme').value;
    let pseudoJoueur1 = document.getElementById('joueur1').value;
    let pseudoJoueur2 = document.getElementById('joueur2').value;

    pseudoJoueur.push(pseudoJoueur1);
    pseudoJoueur.push(pseudoJoueur2);

    playerTeam.innerHTML = pseudoJoueur1;

    if (selectTheme == "naruto") {
        document.documentElement.style.setProperty('--bk-grille', 'url(img/bk-naruto.jpg)');
        document.documentElement.style.setProperty('--jeton-rouge', 'url(img/naruto.png)');
        document.documentElement.style.setProperty('--jeton-jaune', 'url(img/sasuke.jpg)');
    } else if (selectTheme == "psVSxbox") {
        document.documentElement.style.setProperty('--bk-grille', 'url(img/playstationVSxbox.jpg)');
        document.documentElement.style.setProperty('--jeton-rouge', 'url(img/ps.png)');
        document.documentElement.style.setProperty('--jeton-jaune', 'url(img/xbox.jpeg)');
    }

    document.querySelector('.formulaire').classList.add('disabled');
    document.getElementById('PseudoJoueur1').innerHTML = pseudoJoueur1;
    document.getElementById('PseudoJoueur2').innerHTML = pseudoJoueur2;

});

let GRID = [];


for (let i = 0; i < ROWS; i++) {
    GRID.push([]);
    for (let j = 0; j < COLUMNS; j++) {
        GRID[i].push(0);
    }
}


let maGrilleHTML = document.getElementById("grille");
let htmlGrid = "";

for (let i = 0; i < ROWS; i++) {
    htmlGrid += '<div class="row">';
    for (let j = 0; j < COLUMNS; j++) {
        let cellId = i + "," + j;
        htmlGrid += '<div class="cell" id=' + cellId + '></div>';
    }

    htmlGrid += '</div>';
}
maGrilleHTML.innerHTML = htmlGrid;



let gameEnded = false;

function maFonction(event) {
    if (gameEnded && event.key == "Enter") {

        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS; j++) {
                GRID[i][j] = 0;
                document.getElementById(i + "," + j).classList.remove(PLAYER_COLORS[1]);
                document.getElementById(i + "," + j).classList.remove(PLAYER_COLORS[2]);
            }
        }
        document.getElementById('msg-win').style.display = "none";
        document.getElementById('msg-egalite').style.display = "none";
        gameEnded = false;
    }
    let keyCode = event.code;

    if (!keyCode.includes("Digit")) {
        return;
    }
    let characterIndex = keyCode.length - 1;
    let columnString = keyCode.substring(characterIndex);
    let column = parseInt(columnString) - 1;
    play(column);
}
document.addEventListener("keydown", maFonction);


let currentPlayerTurn = 1;

function insertCoin(column) {
    for (let i = 0; i < GRID.length; i++) {
        if (i + 1 >= ROWS || GRID[i + 1][column] != 0) {
            GRID[i][column] = currentPlayerTurn;
            return i;
        }
    }
    return null;
}


const PLAYER_COLORS = ["", "Rouge", "Jaune"];

function insertHTMLCoin(row, column) {
    const currentPlayerColor = PLAYER_COLORS[currentPlayerTurn];
    document.getElementById(row + "," + column).classList.add(currentPlayerColor);
}


const IN_A_ROW = 4;

function foundHorizontalAlignement(row, column) {
    if (column + IN_A_ROW > COLUMNS)
        return false;
    for (let i = 0; i < IN_A_ROW; i++) {
        if (GRID[row][column + i] != currentPlayerTurn) {
            return false;
        }
    }
    return true;
}

function foundVerticalAlignement(row, column) {
    if (row + IN_A_ROW > ROWS)
        return false;
    for (let i = 0; i < IN_A_ROW; i++) {
        if (GRID[row + i][column] != currentPlayerTurn) {
            return false;
        }
    }
    return true;
}

function foundDiagonalRightAlignement(row, column) {
    if (column + IN_A_ROW > COLUMNS || row + IN_A_ROW > ROWS)
        return false;
    for (let i = 0; i < IN_A_ROW; i++) {
        if (GRID[row + i][column + i] != currentPlayerTurn) {
            return false;
        }
    }
    return true;
}

function foundDiagonalLeftAlignement(row, column) {
    if (column - (IN_A_ROW - 1) < 0 || row + IN_A_ROW > ROWS)
        return false;
    for (let i = 0; i < IN_A_ROW; i++) {
        if (GRID[row + i][column - i] != currentPlayerTurn) {
            return false;
        }
    }
    return true;
}

function verification() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            if (
                foundHorizontalAlignement(i, j) ||
                foundVerticalAlignement(i, j) ||
                foundDiagonalLeftAlignement(i, j) ||
                foundDiagonalRightAlignement(i, j)
            ) {
                gameEnded = true;
                win();
                return true;
            }
        }
    }
    return false;
}

let score = ["", 0, 0];

function win() {
    if (currentPlayerTurn == 1) {
        score[1] = score[1] + 1;
        document.getElementById('red-points').innerHTML = score[1];
    } else {
        score[2] = score[2] + 1;
        document.getElementById('yellow-points').innerHTML = score[2];
    }

    document.getElementById('msg-win').style.display = "block";
    document.getElementById('player-win').innerHTML = pseudoJoueur[currentPlayerTurn];
}


function isGridComplete() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            if (GRID[i][j] == 0) {
                return false;
            }
        }
    }
    gameEnded = true;

    document.getElementById('msg-egalite').style.display = "block";

    return true;
}


function changeTurn() {
    if (currentPlayerTurn == 1) {
        currentPlayerTurn = 2;
        playerTurnTeam = pseudoJoueur[2];
        playerTeam.innerHTML = playerTurnTeam;
    } else {
        currentPlayerTurn = 1;
        playerTurnTeam = pseudoJoueur[1];
        playerTeam.innerHTML = playerTurnTeam;
    }
}


let row = 0;

function play(column) {
    if (gameEnded) {
        return;
    }

    row = insertCoin(column);
    insertHTMLCoin(row, column);


    verification();


    isGridComplete(row, column);


    changeTurn(row, column);
}