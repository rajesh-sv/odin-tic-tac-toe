function GameBoard() {
  const row = 3;
  const column = 3;
  const board = [];

  const getRowSize = () => row;

  const getColumnSize = () => column;

  const buildBoard = () => {
    for (let i = 0; i < row; i++) {
      const boardRow = [];
      for (let j = 0; j < column; j++) {
        boardRow.push(Cell());
      }
      board.push(boardRow);
    }
  };

  const getCellValue = (r, c) => {
    return board[r][c].getValue();
  };

  const placeToken = (r, c, token) => {
    if (!board[r][c].canPlace()) {
      return false;
    }
    board[r][c].setValue(token);
    return true;
  };

  const resetBoard = () => {
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        board[i][j] = Cell();
      }
    }
  };

  buildBoard();

  return { getRowSize, getColumnSize, getCellValue, placeToken, resetBoard };
}

function Cell() {
  let value = null;

  const canPlace = () => {
    return value === null;
  };

  const getValue = () => {
    return value;
  };

  const setValue = (token) => {
    value = token;
  };

  return { canPlace, getValue, setValue };
}

function Player(playerName, playerToken) {
  const name = playerName;
  const token = playerToken;

  const getName = () => {
    return name;
  };

  const getToken = () => {
    return token;
  };

  return { getName, getToken };
}

function GameController() {
  const gameBoard = GameBoard();
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");

  let activePlayer = player1;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const getActivePlayer = () => {
    return activePlayer;
  };

  const gameOver = () => {
    let i, j;
    const row = gameBoard.getRowSize();
    const column = gameBoard.getColumnSize();
    const gameDetails = {
      gameOver: false,
      draw: false,
    };

    for (i = 1; i < row; i++) {
      if (
        gameBoard.getCellValue(0, 0) !== gameBoard.getCellValue(i, i) ||
        gameBoard.getCellValue(i, i) === null
      )
        break;
    }
    if (i === row) gameDetails.gameOver = true;

    for (i = 1; i < row; i++) {
      if (
        gameBoard.getCellValue(0, row - 1) !==
          gameBoard.getCellValue(i, row - i - 1) ||
        gameBoard.getCellValue(i, row - i - 1) === null
      )
        break;
    }
    if (i === row) gameDetails.gameOver = true;

    for (i = 0; i < row; i++) {
      for (j = 1; j < column; j++) {
        if (
          gameBoard.getCellValue(i, 0) !== gameBoard.getCellValue(i, j) ||
          gameBoard.getCellValue(i, j) === null
        )
          break;
      }
      if (j === column) gameDetails.gameOver = true;
    }

    for (j = 0; j < column; j++) {
      for (i = 1; i < row; i++) {
        if (
          gameBoard.getCellValue(0, j) !== gameBoard.getCellValue(i, j) ||
          gameBoard.getCellValue(i, j) === null
        )
          break;
      }
      if (i === row) gameDetails.gameOver = true;
    }

    let boardFull = true;
    for (i = 0; i < row; i++) {
      for (j = 0; j < column; j++) {
        if (gameBoard.getCellValue(i, j) === null) {
          boardFull = false;
        }
      }
    }
    if (boardFull) {
      gameDetails.gameOver = true;
      gameDetails.draw = true;
    }

    return gameDetails;
  };

  const playRound = (r, c) => {
    const roundDetails = {
      r,
      c,
      gameOver: false,
      validMove: false,
      gameDraw: false,
      playedBy: activePlayer,
    };

    if (gameBoard.placeToken(r, c, activePlayer.getToken())) {
      roundDetails.validMove = true;
      const gameDetails = gameOver();
      if (gameDetails.gameOver) {
        roundDetails.gameOver = true;
        roundDetails.gameDraw = gameDetails.draw;
        activePlayer = player1;
        resetGame();
      } else {
        switchPlayerTurn();
      }
    }

    return roundDetails;
  };

  const resetGame = () => {
    gameBoard.resetBoard();
  };

  return {
    getActivePlayer,
    playRound,
    resetGame,
    getRowSize: gameBoard.getRowSize,
    getColumnSize: gameBoard.getColumnSize,
    getCellValue: gameBoard.getCellValue,
  };
}

function UIController() {
  let gamesPlayed = 0;
  let player1Wins = 0;
  let player2Wins = 0;
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

  const game = GameController();
  const gameCountSpan = document.querySelector(".game-count");
  const player1GamesWonSpan = document.querySelector(".player1.games-won");
  const player2GamesWonSpan = document.querySelector(".player2.games-won");
  const playerTurnDiv = document.querySelector(".player-turn");
  const gameBoardDiv = document.querySelector(".game-board");
  const resetGameButton = document.querySelector(".reset-game");

  const buildGameBoard = () => {
    gameBoardDiv.textContent = "";

    const row = game.getRowSize();
    const column = game.getColumnSize();

    for (let i = 0; i < row; i++) {
      const gameBoardRowDiv = document.createElement("div");
      gameBoardRowDiv.classList.add("game-board-row");
      for (let j = 0; j < column; j++) {
        const gameBoardCellButton = document.createElement("button");
        gameBoardCellButton.classList.add("game-board-cell");
        gameBoardCellButton.type = "button";
        gameBoardCellButton.dataset.row = i;
        gameBoardCellButton.dataset.column = j;
        gameBoardRowDiv.appendChild(gameBoardCellButton);
      }
      gameBoardDiv.appendChild(gameBoardRowDiv);
    }
  };

  const resetGame = () => {
    gamesPlayed = player1Wins = player2Wins = 0;
    updateGameCountSpans();
    resetGameBoard();
  };

  const resetGameBoard = () => {
    const row = game.getRowSize();
    const column = game.getColumnSize();

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        gameBoardDiv.children[i].children[j].textContent = "";
      }
    }

    game.resetGame();
  };

  const updateGameCountSpans = () => {
    gameCountSpan.textContent = `${gamesPlayed}`;
    player1GamesWonSpan.textContent = `${player1Wins}`;
    player2GamesWonSpan.textContent = `${player2Wins}`;
  };

  const updatePlayerTurnDiv = () => {
    playerTurnDiv.textContent = `${game.getActivePlayer().getName()}'s turn...`;
  };

  const updateGameBoardDiv = (r, c, token) => {
    gameBoardDiv.children[r].children[c].textContent = token;
  };

  const updateScreen = (roundDetails) => {
    updatePlayerTurnDiv();
    if (roundDetails.validMove) {
      updateGameBoardDiv(
        roundDetails.r,
        roundDetails.c,
        roundDetails.playedBy.getToken()
      );
    }
    if (roundDetails.gameOver) {
      (async function () {
        await new Promise((r) => setTimeout(r, 50));
        ++gamesPlayed;
        if (roundDetails.gameDraw) {
          alert("Game Draw");
        } else {
          if (roundDetails.playedBy.getName() === "Player 1") {
            player1Wins++;
          } else {
            player2Wins++;
          }
          alert(`${roundDetails.playedBy.getName()} wins this game!`);
        }
        updateGameCountSpans();
        resetGameBoard();
      })();
    }
  };

  gameBoardDiv.addEventListener("click", (event) => {
    if (event.target.dataset.row) {
      const r = event.target.dataset.row;
      const c = event.target.dataset.column;
      const roundDetails = game.playRound(r, c);
      updateScreen(roundDetails);
    }
  });

  resetGameButton.addEventListener("click", resetGame);

  buildGameBoard();
  updateScreen();
}

UIController();
