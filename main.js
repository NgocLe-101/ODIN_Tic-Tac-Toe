const gameManager = (
    function() {
        const _player1 = createUser('Player1', 1);
        const _player2 = createUser('Player2', -1);
        let winner = null;
        const gameBoard = (
            function() {
                let _board = [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ];
                const getBoard = () => {
                    let board = '';
                    for (let i = 0; i < _board.length; i++) {
                        for (let j = 0; j < _board[i].length; j++) {
                            if (_board[i][j] === 1) {
                                board += ' o |';
                            } else if (_board[i][j] === -1) {
                                board += ' X |';
                            } else {
                                board += '   |';
                            }
                        }
                        board += '\n';
                    }
                    board += '\n';
                    return board;
                };
                const moveOnBoard = (x,y) => {
                    const player = getActivePlayer().getMoveType();
                    if (_isValidMove(x,y)) {
                        _board[x][y] = player;
                        switchTurn();
                        if (_getBoardStateOnMove(x,y)) {
                            _boardState = false;
                            if (!_checkFullBoard()) {
                                winner = player === _player1.getMoveType() ? _player1 : _player2;
                            }
                        }
                        return true;
                    }
                    return false;
                }
                const _isValidMove = (x,y) => {
                    if (x > _board.length || x < 0 || y > _board[0].length || y < 0) {
                        return false;
                    }
                    if(_board[x][y] === 0) {
                        return true && _boardState;
                    }
                    return false;
                }
                let _boardState = true; // is not ended
                const _checkHorizontal = (x,playerMove) => {
                    let count = 0;
                    for (let i = 0; i < _board[x].length; i++) {
                        if (_board[x][i] === playerMove) {
                            count++;
                        }
                    }
                    if (count === 3)
                        return true;
                    return false;
                }
                const _checkVertical = (y,playerMove) => {
                    let count = 0;
                    for (let i = 0; i < _board.length; i++) {
                        if (_board[i][y] === playerMove) {
                            count++;
                        }
                    }
                    if (count === 3)
                        return true;
                    return false;
                }
                const _checkDiagonal = (x,y,playerMove) => {
                    let count = 0;
                    if (x === y) {
                        for (let i = 0, j = 0; i < _board.length && j < _board.length; i++, j++) {
                            if (_board[i][j] === playerMove) {
                                count++;
                            }
                        }
                        if (count === 3)
                            return true;
                        if (x === 1) {
                            count = 0;
                            for (let i = _board.length - 1, j = 0; i >= 0 && j < _board.length; i--, j++) {
                                if (_board[i][j] === playerMove) {
                                    count++;
                                }
                            }
                            if (count === 3)
                                return true;
                        }
                    } else if (x !== y) {
                        for (let i = _board.length - 1, j = 0; i >= 0 && j < _board.length; i--, j++) {
                            if (_board[i][j] === playerMove) {
                                count++;
                            }
                        }
                        if (count === 3)
                            return true;
                    }
                    return false;
                }
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
                }
                const _getBoardStateOnMove = (x,y) => {
                    const playerMove = _board[x][y];
                    let verticalCheck = _checkVertical(y,playerMove);
                    let horizontalCheck = _checkHorizontal(x,playerMove);
                    let diagonalCheck = _checkDiagonal(x,y,playerMove);
                    let checkFullBoard = _checkFullBoard();
                    return verticalCheck || horizontalCheck || diagonalCheck || checkFullBoard;
                } 
                const getBoardState = function() {
                    return _boardState;
                }
                return { getBoard, moveOnBoard, getBoardState };
            }
        )();
        let _playerTurn = true; // true = player1's turn, false = player2's turn
        const switchTurn = () => { _playerTurn = !_playerTurn; }
        const isEnded = () => { 
            return !gameBoard.getBoardState();
        }
        const getWinner = () => {
            return winner;
        }
        const getActivePlayer = () => {
            return _playerTurn ? _player1 : _player2;
        }
        return { switchTurn, isEnded, getWinner, gameBoard, getActivePlayer }
    }
)();

function createUser(name, typeOfMove) {
    let _moveType = typeOfMove;
    let _pName = name;
    const setMoveType = (moveType) => {
        if (moveType === 1 || moveType === -1) {
            _moveType = moveType;
        }
    }
    const setPlayerName = (name) => {
        _pName = name;
    }
    const getName = () => { return _pName; }
    const getMoveType = () => { return _moveType; }
    return { getName, getMoveType, setMoveType, setPlayerName };
}

console.log("Tic Tac Toe Game!\n")
while (!gameManager.isEnded()) {
    console.log(gameManager.gameBoard.getBoard());
    console.log(`${gameManager.getActivePlayer().getName()}'s turn\n`);
    let input = prompt('Choose where to move: ').split(',');
    let x = input[0];
    let y = input[1];
    console.log(`${gameManager.getActivePlayer().getName()} choose: (${x},${y})\n`)
    while (!gameManager.gameBoard.moveOnBoard(x,y)) {
        alert('Invalid move!');
        input = prompt('Choose where to move: ').split(',');
        x = input[0];
        y = input[1];
        console.log(`${gameManager.getActivePlayer().getName()} choose: (${x},${y})\n`)
    }
}
console.log('Game Ended! ')
if (gameManager.getWinner() === null) {
    console.log('Tie');
} else {
    let winner = gameManager.getWinner().getName();
    console.log(`${winner} won!`);
}