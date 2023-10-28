const gameBoard = (function() {
    let board = ["", "", "", "", "", "", "", "", ""];

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
            console.log(board);
        }
    }

    const addMark = function(index, sign) {
        if (index > board.length) return; 
        board[index] = sign; 
        console.log(board);
    }

    const getMark = function(index) {
        if (index > board.length) return; 
        return board[index]; 
    }

    return {addMark, getMark, resetBoard}; 
})(); 

const displayController = (function() {
    const gameResult = document.querySelector('.gameResult'); 
    const playerTurn = document.querySelector('.playerTurn');
    const playAgainButton = document.querySelector('.playAgain'); 
    const boardCells = document.querySelectorAll('.cell'); 

    boardCells.forEach(cell => {
        cell.addEventListener('click', (e) => {
            if (gameController.getIsOver() || e.target.textContent != "") return; 
            gameController.playRound(parseInt(e.target.dataset.index)); 
            updateDOMBoard(); 
        })
    })

    playAgainButton.addEventListener('click', () => {
        gameBoard.resetBoard(); 
        gameController.reset(); 
        updateDOMBoard(); 
        gameResult.textContent = "";
        setPlayerTurn(`Player 1's Turn`)
    })

    const updateDOMBoard = () => {
        for (let i = 0; i < boardCells.length; i++) {
            boardCells[i].textContent = gameBoard.getMark(i); 
        }
    }

    const setGameResult = (result) => {
        if (result === "Tie") {
            gameResult.innerText = "It's a Tie! Nobody wins."; 
        }
        else {
            gameResult.innerText = `${result} wins!`; 
        }
    }

    const setPlayerTurn = (message) => {
        playerTurn.textContent = message;
    }

    return {setGameResult, setPlayerTurn};

})();

const gameController = (function() {

    // Creating the players. 
    let playerOne = createUser('Player 1', 'O'); 
    let playerTwo = createUser('Player 2', 'X');

    let round = 1; 
    let isOver = false; 

    const playRound = (cellIndex) => {
        gameBoard.addMark(cellIndex, getCurrentPlayerSign());
        if (playerWon(cellIndex)) {
            displayController.setPlayerTurn("Game Finished!");
            displayController.setGameResult(getCurrentPlayer());
            isOver = true; 
            return; 
        }
        if (round === 9) {
            displayController.setPlayerTurn("Game Finished!");
            displayController.setGameResult('Tie'); 
            isOver = true; 
            return; 
        }
        round += 1; 
        displayController.setPlayerTurn(
            `${getCurrentPlayer()}'s turn`
        );
    }

    const getCurrentPlayerSign = () => {
        return round % 2 === 1 ? playerOne.symbol : playerTwo.symbol; 
    }

    const getCurrentPlayer = function() {
        return round % 2 === 1 ? playerOne.name : playerTwo.name;
    }

    // Checking if current player won by comparing every winning combination with the player's moves. 
    const playerWon = function(fieldIndex) {
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
        return winConditions
            .filter((combination) => combination.includes(fieldIndex))
            .some((possibleCombination) =>
            possibleCombination.every(
             (index) => gameBoard.getMark(index) === getCurrentPlayerSign()
            )
      );
    }

    const getIsOver = () => {
        return isOver; 
    }

    const reset = () => {
        round = 1; 
        isOver = false; 
    }

    return {playRound, getIsOver, reset, getCurrentPlayer}; 
})();

// Factory Function - Creating Players 
function createUser(name, symbol) {
    this.name = name; 
    this.symbol = symbol; 

    return {name, symbol}; 
}


