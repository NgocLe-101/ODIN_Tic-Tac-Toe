const gameManager = (function () {
  const _player1 = createUser("Player1", 1);
  const _player2 = createUser("Player2", -1);
  let winner = null;
  const gameBoard = (function () {
    let _board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    const getBoard = () => _board;
    const moveOnBoard = (x, y) => {
      const player = getActivePlayer().getMoveType();
      if (_isValidMove(x, y)) {
        _board[x][y] = player;
        switchTurn();
        if (_getBoardStateOnMove(x, y)) {
          _boardState = false;
          if (!_checkFullBoard()) {
            winner = player === _player1.getMoveType() ? _player1 : _player2;
          }
        }
        return true;
      }
      return false;
    };
    const _isValidMove = (x, y) => {
      if (x > _board.length || x < 0 || y > _board[0].length || y < 0) {
        return false;
      }
      if (_board[x][y] === 0) {
        return true && _boardState;
      }
      return false;
    };
    let _boardState = true; // is not ended
    const _checkHorizontal = (x, playerMove) => {
      let count = 0;
      for (let i = 0; i < _board[x].length; i++) {
        if (_board[x][i] === playerMove) {
          count++;
        }
      }
      if (count === 3) return true;
      return false;
    };
    const _checkVertical = (y, playerMove) => {
      let count = 0;
      for (let i = 0; i < _board.length; i++) {
        if (_board[i][y] === playerMove) {
          count++;
        }
      }
      if (count === 3) return true;
      return false;
    };
    const _checkDiagonal = (x, y, playerMove) => {
      let count = 0;
      if (x === y) {
        for (
          let i = 0, j = 0;
          i < _board.length && j < _board.length;
          i++, j++
        ) {
          if (_board[i][j] === playerMove) {
            count++;
          }
        }
        if (count === 3) return true;
        if (x === 1) {
          count = 0;
          for (
            let i = _board.length - 1, j = 0;
            i >= 0 && j < _board.length;
            i--, j++
          ) {
            if (_board[i][j] === playerMove) {
              count++;
            }
          }
          if (count === 3) return true;
        }
      } else if (x !== y) {
        for (
          let i = _board.length - 1, j = 0;
          i >= 0 && j < _board.length;
          i--, j++
        ) {
          if (_board[i][j] === playerMove) {
            count++;
          }
        }
        if (count === 3) return true;
      }
      return false;
    };
    const _checkFullBoard = () => {
      let count = 0;
      for (let i = 0; i < _board.length; i++) {
        for (let j = 0; j < _board[i].length; j++) {
          if (_board[i][j] !== 0) {
            count++;
          }
        }
      }
      if (count === _board.length * _board[0].length) {
        return true;
      }
      return false;
    };
    const _getBoardStateOnMove = (x, y) => {
      const playerMove = _board[x][y];
      let verticalCheck = _checkVertical(y, playerMove);
      let horizontalCheck = _checkHorizontal(x, playerMove);
      let diagonalCheck = _checkDiagonal(x, y, playerMove);
      let checkFullBoard = _checkFullBoard();
      return (
        verticalCheck || horizontalCheck || diagonalCheck || checkFullBoard
      );
    };
    const getBoardState = function () {
      return _boardState;
    };
    return { getBoard, moveOnBoard, getBoardState };
  })();
  let _playerTurn = true; // true = player1's turn, false = player2's turn
  const switchTurn = () => {
    _playerTurn = !_playerTurn;
  };
  const isEnded = () => {
    return !gameBoard.getBoardState();
  };
  const getWinner = () => {
    return winner;
  };
  const getActivePlayer = () => {
    return _playerTurn ? _player1 : _player2;
  };
  const getPlayerList = () => {
    return [_player1, _player2];
  };
  return {
    switchTurn,
    isEnded,
    getWinner,
    gameBoard,
    getActivePlayer,
    getPlayerList,
  };
})();

function createUser(name, typeOfMove) {
  let _moveType = typeOfMove;
  let _pName = name;
  const setMoveType = (moveType) => {
    if (moveType === 1 || moveType === -1) {
      _moveType = moveType;
    }
  };
  const setPlayerName = (name) => {
    _pName = name;
  };
  const getName = () => {
    return _pName;
  };
  const getMoveType = () => {
    return _moveType;
  };
  return { getName, getMoveType, setMoveType, setPlayerName };
}

const displayController = (function () {
  const _boardContainer = document.querySelector("div.board-container");
  const renderPlayerInfos = () => {
    const playerList = gameManager.getPlayerList();
    const p1Info = document.querySelector(".header #player1 h1");
    const p2Info = document.querySelector(".header #player2 h1");

    p1Info.innerText = playerList[0].getName();
    p2Info.innerText = playerList[1].getName();
  };
  const renderBoard = () => {
    _clearBoard();
    const board = gameManager.gameBoard.getBoard();
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        let boardCell = _createBoardCell(i, j);
        _boardContainer.appendChild(boardCell);
      }
    }
  };
  const _clearBoard = () => {
    _boardContainer.innerHTML = "";
  };
  const _createBoardCell = (x, y) => {
    const cellContainer = document.createElement("div");
    cellContainer.innerHTML = `
                <svg style="display: none" class="X" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>alpha-x</title><path d="M9,7L11,12L9,17H11L12,14.5L13,17H15L13,12L15,7H13L12,9.5L11,7H9Z" /></svg>
                <svg style="display: none" class="O" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>alpha-o</title><path d="M11,7A2,2 0 0,0 9,9V15A2,2 0 0,0 11,17H13A2,2 0 0,0 15,15V9A2,2 0 0,0 13,7H11M11,9H13V15H11V9Z" /></svg>
            `;
    cellContainer.id = `${x}${y}`;
    cellContainer.className = "board-cell";
    cellContainer.addEventListener("click", () => {
      if (gameManager.gameBoard.moveOnBoard(x, y)) {
        const pMoveType = gameManager.getActivePlayer().getMoveType();
        if (pMoveType === 1) {
          cellContainer.querySelector("svg.O").setAttribute("style", "");
        } else if (pMoveType === -1) {
          cellContainer.querySelector("svg.X").setAttribute("style", "");
        }
        // Check if the game has ended after the move
        if (gameManager.isEnded()) {
          // Use setTimeout to delay the alert
          setTimeout(() => {
            alert("Game ended!");
          }, 0); // 0 milliseconds delay
        }
      } else {
        alert("Invalid move!");
      }
    });
    return cellContainer;
  };
  return { renderBoard };
})();

displayController.renderBoard();

// console.log("Tic Tac Toe Game!\n")
// while (!gameManager.isEnded()) {
//     console.log(gameManager.gameBoard.getBoard());
//     console.log(`${gameManager.getActivePlayer().getName()}'s turn\n`);
//     let input = prompt('Choose where to move: ').split(',');
//     let x = input[0];
//     let y = input[1];
//     console.log(`${gameManager.getActivePlayer().getName()} choose: (${x},${y})\n`)
//     while (!gameManager.gameBoard.moveOnBoard(x,y)) {
//         alert('Invalid move!');
//         input = prompt('Choose where to move: ').split(',');
//         x = input[0];
//         y = input[1];
//         console.log(`${gameManager.getActivePlayer().getName()} choose: (${x},${y})\n`)
//     }
// }
// console.log('Game Ended! ')
// if (gameManager.getWinner() === null) {
//     console.log('Tie');
// } else {
//     let winner = gameManager.getWinner().getName();
//     console.log(`${winner} won!`);
// }
