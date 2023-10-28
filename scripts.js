const gameBoard = (function() {
    let board = ["", "", "", "", "", "", "", "", ""];
    let boardIndex = {
        "one": 0, 
        "two": 1, 
        "three": 2, 
        "four": 3, 
        "five": 4, 
        "six": 5, 
        "seven": 6, 
        "eight": 7, 
        "nine": 8
    }; 

    const renderBoard = function (curPlayer, playerOne, playerTwo) {
        // For each cell in board array, populate DOM game board accordingly.
        for (let c = 0; c < 10; c++) {
            if (board[c] == "X"){
                cells[c].innerText = "X"; 
            }
            else if (board[c] == "O"){
                cells[c].innerText = "O"; 
            }
            else {
                continue;
            }
        }

        // Selecting all the board cells in the DOM.
        const cells = document.querySelectorAll('.cell'); 

        // Changing cell's value to current player's symbol. 
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                let isValidMove = gameBoard.addPlayerMark(cell, curPlayer); 
                if (isValidMove) {
                    let playerWins = gameBoard.playerWon(curPlayer); 
                    let gameResult = document.querySelector('.gameResult'); 
                    if (playerWins) {
                        gameResult.innerText = `${curPlayer.name} has won the game!`; 
                        return; 
                    }
                    let isTie = gameBoard.isFilled(); 
                    if (isTie) {
                        gameResult.innerText = `It's a Tie! Nobody wins.`; 
                        return; 
                    }
                    curPlayer = changePlayer(curPlayer, playerOne, playerTwo); 
                }
            })
        })
        return curPlayer; 
    }

    const addPlayerMark = function(cell, player) {
        if (cell.innerText === "") {
            cell.innerText = `${player.symbol}`; 
            const cellIndex = boardIndex[cell.className.split(' ')[1]];
            player.moves.add(cellIndex);
            board[cellIndex] =  `${player.symbol}`; 
            return true; 
        }
        return false; 
    }

    // Checking if current player won by comparing every winning combination with the player's moves. 
    const playerWon = function(player) {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        let isWon = false; 
        winConditions.forEach(winCondition => {
            let matches = 0; 
            winCondition.forEach(index => {
                if (player.moves.has(index)) {
                    matches += 1; 
                }
            })
            if (matches === 3) {
               isWon = true; 
            }
        })
        return isWon; 
    }

    const isFilled = function() {
        let isBoardFilled = true; 
        board.forEach(cell => {
            if (cell === "") {
                isBoardFilled = false; 
            }
        })
        return isBoardFilled; 
    }

   
    return {renderBoard, addPlayerMark, playerWon, isFilled}; 
})(); 

const game = (function() {

    const start = function(p1, p2) {
        gameStatus = true; 
        gameTie = false; 
        let playerOneName = p1; 
        let playerTwoName = p2; 

        // Creating the players. 
        let playerOne = createUser(playerOneName, 'O'); 
        let playerTwo = createUser(playerTwoName, 'X');

        // Setting the initial current player. 
        let curPlayer = playerOne; 

        curPlayer = gameBoard.renderBoard(curPlayer, playerOne, playerTwo); 
    }

    return {start}; 
})();

// Factory Function - Changing player's turns
function changePlayer(curPlayer, playerOne, playerTwo) {
    return curPlayer === playerOne ? playerTwo : playerOne; 
}

// Factory Function - Creating Players 
function createUser(name, symbol) {
    let moves = new Set(); 
    return {name, symbol, moves}; 
}

const playButton = document.querySelector('.playButton'); 

playButton.addEventListener('click', (e) => {
    e.preventDefault();
    playerOneName = document.querySelector('#player1Name').value; 
    playerTwoName = document.querySelector('#player2Name').value;
    document.querySelector('.gameBoard').classList.toggle('hidden'); 
    document.querySelector('form').classList.add('hidden');
    game.start(playerOneName, playerTwoName);
})
