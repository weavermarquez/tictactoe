type Player = 'X' | 'O' | '-';
type PlayStatus = 'In progress' | 'Complete';
type Board = Array<Array<Player>>

type Target = {
    row: number,
    col: number
  }
type Move = {
  id: number,
  player: Player,
  target: Target,
}

type GameState = {
  player: Player,
  board: Board
  status: PlayStatus,
  winner: Player,
  history: Array<Move>
}

type WinState = [boolean, Player]

function nextPlayer (player: Player): Player {
  switch (player) {
    case 'X':
      return 'O'

    case 'O':
      return 'X'

    default:
      return 'X'
  }
}


function nextId(game: GameState): number {
  return game.history.length + 1
}

function cell(board: Board, coord: Target): Player {
  if (coord.row < 3 && coord.row >= 0 && coord.col < 3 && coord.col >= 0){
    return board[coord.row][coord.col]
  }
  // TODO throw error
}

/*
 * @returns {Board} The `board` with `target` cell changed to `player`
 */
function updateBoard(board: Board, player: Player, target: Target): Array<Array<Player>> {
  return board.map( (row, rowIndex) =>
    target.row == rowIndex ?
      row.map( (cell, cellIndex) => target.col == cellIndex ? player : cell )
      : row
  )
}

function transpose(matrix: any) {
  return matrix[0].map((col: any[], c: number) =>
    matrix.map((row: any[], r: number) => matrix[r][c]));
}

function allEqual (arr: Player[]) {
  return arr.every(val => val === arr[0])
}

function matchVertical(board: Board): WinState {
  const transposedBoard = transpose(board)
  console.log("transposed", transposedBoard)

  return transposedBoard.reduce((winState: WinState, row: Player[]): WinState => {
    return winState[0] ?
      winState // Propagate a true win-detection forward.
      : [allEqual(row),
        allEqual(row) ? row[0] : '-'] // base-case: there may be a winner.
  }, [false, '-'])
}


function matchHorizontal(board: Board): WinState {
  return board.reduce((winState: WinState, row: Player[]): WinState => {
    return winState[0] ?
      winState // Propagate a true win-detection forward.
      : [allEqual(row),
        allEqual(row) ? row[0] : '-'] // base-case: there may be a winner.
  }, [false, '-'])
}


function matchDiagonal(board: Board): WinState {
  const diagonals = [
    [board[0][0], board[1][1], board[2][2]],
    [board[0][2], board[1][1], board[2][0]]
  ]

  return diagonals.reduce((winState: WinState, row: Player[]): WinState => {
    // predicate function. return true if there is a winner;
    return winState[0] ?
      winState // Propagate a win-detection forward.
      : [allEqual(row), row[0]] // base-case: there may be a winner and if there is,
  }, [false, '-'])
}


function detectWinner(board: Board, history: Array<Move>): WinState {
  const MAX_HISTORY = 9

  const winCheck = {
    horizontal: matchHorizontal(board),
    vertical: matchVertical(board),
    diagonal: matchDiagonal(board),
  }

  if (winCheck.horizontal[0]){
    return winCheck.horizontal
  } else if (winCheck.vertical[0]) {
    return winCheck.vertical
  } else if (winCheck.diagonal[0]) {
    return winCheck.diagonal
  } else {
    console.log("draw or in progress")
    return history.length == MAX_HISTORY ?
      [true, '-']  // draw
      : [false, '-'] // in progress
  }
}

function makeMove(game: GameState, player: Player, target: Target): GameState {
  const MAX_HISTORY = 9

  // validate the move: is target cell empty? is input player current player?
  if (cell(game.board, target) != '-') {
    console.log('ERROR: Board already populated!')
    // Probably just return the current gamestate.
    return game
  }
  if (game.player != player && game.history.length < MAX_HISTORY){
    console.log('ERROR: Wrong Player!')
  }

  const currentMove: Move = {id: nextId(game), player, target}


  const newBoard = updateBoard(game.board, player, target)
  const newHistory = [...game.history, currentMove]
  const newWinState = detectWinner(newBoard, newHistory)

  const newStatus: PlayStatus = newWinState[0] ?
    'Complete'
    : 'In progress'


  // update status and check for winner
  // switch players
  const nextGameState: GameState = {
    player: nextPlayer(game.player),
    board: updateBoard(game.board, player, target),
    status: newStatus,
    winner: newWinState[1],
    history: [...game.history, currentMove]
  }
  return nextGameState
}

const emptyBoard: Board =
      [[ '-', '-', '-' ],   // 0,0  0,1  0,2
       [ '-', '-', '-' ],   // 1,0  1,1  1,2
       [ '-', '-', '-' ],]; // 2,0  2,1  2,2


// const testBoard: Board =
//       [[ 'O', 'X', 'O' ],   // 0,0  0,1  0,2
//        [ 'X', 'X', 'O' ],   // 1,0  1,1  1,2
//        [ 'X', 'O', 'X' ],]; // 2,0  2,1  2,2

// const drawGameHistory: Move[] = [
//   {id: 1, player: 'X', target: {row: 1, col: 1}},
//   {id: 2, player: 'O', target: {row: 0, col: 0}},
//   {id: 3, player: 'X', target: {row: 2, col: 0}},
//   {id: 4, player: 'O', target: {row: 0, col: 2}},
//   {id: 5, player: 'X', target: {row: 1, col: 0}},
//   {id: 6, player: 'O', target: {row: 1, col: 2}},
//   {id: 7, player: 'X', target: {row: 0, col: 1}},
//   {id: 8, player: 'O', target: {row: 2, col: 1}},
//   {id: 9, player: 'X', target: {row: 2, col: 2}}
// ];

// console.log("winner check", detectWinner(testBoard, drawGameHistory))

function newGame(): GameState {
  return {
    player: nextPlayer('-'),
    board: emptyBoard,
    status: 'In progress',
    winner: '-',
    history: []
  }
}

export { type GameState, makeMove, newGame }
