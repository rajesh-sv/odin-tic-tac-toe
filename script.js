function GameBoard() {
    const row = 3;
    const column = 3;
    const board = [];

    const buildBoard = () => {
        for (let i=0; i < row; i++) {
            const boardRow = [];
            for  (let j=0; j < column; j++) {
                boardRow.push(Cell());
            }
            board.push(boardRow);
        }
    };

    const getBoard = () => {
        let boardString = '';

        board.forEach((row) => {
            let rowString = ' | ';
            row.forEach((cell) => {
                rowString += cell.getValue() + ' | ';
            });
            boardString += rowString + '\n';
        });

        return boardString;
    };

    const placeToken = (r, c, player) => {
        if (!board[r][c].canPlace()) {
            return false;
        }
        board[r][c].setValue(player.getToken());
        return true;
    };

    const resetBoard = () => {
        for (let i=0; i < row; i++) {
            for (let j=0; j < column; j++) {
                board[i][j] = Cell();
            }
        }
    };

    const isGameOver = () => {
        let i, j;

        for (i=1; i < row; i++) {
            if ((board[0][0].getValue() !== board[i][i].getValue()) || board[i][i].getValue() === null)
                break
        }
        if (i === row)
            return true;

        for (i=1; i < row; i++) {
            if ((board[0][row - 1].getValue() !== board[i][row - i - 1].getValue()) || board[i][row - i - 1].getValue() === null)
                break
        }
        if (i === row)
            return true;

        for (i=0; i < row; i++) {
            for (j=1; j < column; j++) {
                if ((board[i][0].getValue() !== board[i][j].getValue()) || board[i][j].getValue() === null)
                    break;
            }
            if (j === column)
                return true;
        }

        for (j=0; j < column; j++) {
            for (i=1; i < row; i++) {
                if ((board[0][j].getValue() !== board[i][j].getValue()) || board[i][j].getValue() === null)
                    break;
            }
            if (i === row)
                return true;
        }
    };

    buildBoard();

    return { getBoard, placeToken, isGameOver, resetBoard };
}

function Cell() {
    let value = null;

    const canPlace = () => {
        return value === null;
    }

    const getValue = () => {
        return value;
    }

    const setValue = (token) => {
        value = token;
    }

    return { canPlace, getValue, setValue };
}

function Player(playerName, playerToken) {
    const name = playerName;
    const token = playerToken;
    
    const getName = () => {
        return name;
    }

    const getToken = () => {
        return token;
    }

    return { getName, getToken };
}

function GameLogic() {
    const gameBoard = GameBoard();
    const player1 = Player('Player 1', 'X');
    const player2 = Player('Player 2', 'O');

    let activePlayer = player1;
    
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === player1? player2: player1;
    };

    const printBoard = () => {
        console.log(gameBoard.getBoard());
    }

    const playRound = () => {
        const r = Number(prompt(`${activePlayer.getName()}, please enter row:`));
        const c = Number(prompt(`${activePlayer.getName()}, please enter column:`));
        if (!gameBoard.placeToken(r, c, activePlayer)) {
            alert('Cell already occupied');
            playRound();
        }
        if (gameBoard.isGameOver()) {
           console.log(`${activePlayer.getName()} won the game!`);
           gameBoard.resetBoard();
        } else {
            switchPlayerTurn();
            printBoard();
            playRound();
        }
    }

    printBoard();
    playRound();
}
