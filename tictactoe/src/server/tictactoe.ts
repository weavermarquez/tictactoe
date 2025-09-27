type Player = 'X' | 'O';
type Cell = Player | '-';
type Status = 'winner' | 'draw' | 'ongoing';
type Board = Array<Array<Cell>>

type Target = {row: number, col: number}
type Move = {
  gameID: string | null,
  moveCount: number,
  player: Player,
  target: Target,
  createdAt: Date | null,
}

type GameState = {
  gameID: string,
  player: Player,
  board: Board,
  status: Status,
  winner: Player | null,
  createdAt: string | null,
  updatedAt: string | null
}

function nextPlayer (player: Player): Player {
  switch (player) {
    case 'X': return 'O'

    case 'O': return 'X'

    default: return 'X'
  }
}


function cell(board: Board, coord: Target): Cell {
  return board[coord.row][coord.col]
}

/*
 * @returns {Board} The `board` with `target` cell changed to `player`
 */
function updateBoard(board: Board, player: Player, target: Target): Array<Array<Cell>> {
  return board.map( (row, rowIndex) =>
    target.row == rowIndex ?
      row.map( (cell, cellIndex) => target.col == cellIndex ? player : cell )
      : row
  )
}


function detectWinner(board: Board): {status: Status, winner: Player | null} {
  const MAX_TURNS= 9

  const patterns = [
    //horizontals
    [board[0][0], board[1][0], board[2][0]],
    [board[0][1], board[1][1], board[2][1]],
    [board[0][2], board[1][2], board[2][2]],
    //verticals
    [board[0][0], board[0][1], board[0][2]],
    [board[1][0], board[1][1], board[1][2]],
    [board[2][0], board[2][1], board[2][2]],
    //diagonals
    [board[0][0], board[1][1], board[2][2]],
    [board[0][2], board[1][1], board[2][0]],
  ];

  function allEqual (arr: Cell[]) {return arr.every(val => val === arr[0])}
  const winPattern = patterns.find( pattern => (allEqual(pattern) && pattern[0] !== '-'))

  const turnCount = board.flat().filter(cell => cell != '-').length

    // .filter(cell => cell == '-')

  if (winPattern) {
    console.log("Found a winner!", winPattern[0])
    return {status: 'winner', winner: winPattern[0] as Player}
  } else if (turnCount == MAX_TURNS) {
    return {status: 'draw', winner: null }
  } else {
    return {status: 'ongoing', winner: null }
  }
}

function makeMove(game: GameState, player: Player, target: Target): GameState {
  const MAX_TURNS = 9

  if (game.status == 'winner'){
    return game
  }
  if (!(target.row < 3 && target.row >= 0 && target.col < 3 && target.col >= 0)){
    console.log('ERROR: Malformed request')
    return game
  }
  if (cell(game.board, target) != '-') {
    console.log('ERROR: Board already populated!')
    return game
  }
  if (game.player != player){
    console.log('ERROR: Wrong Player!')
    return game
    // what to do? Reset game? return initGame()?
  }

  // const currentMove: Move = {moveCount: nextMoveCount(game), player, target}

  const newBoard = updateBoard(game.board, player, target)
  const { newStatus, newWinner } = detectWinner(newBoard)

  const nextGameState: GameState = {
    gameID: game.gameID,
    player: nextPlayer(game.player),
    board: updateBoard(game.board, player, target),
    status: newStatus,
    winner: newWinner,
  }
  return nextGameState
}

const emptyBoard: Board =
      [[ '-', '-', '-' ],   // 0,0  0,1  0,2
       [ '-', '-', '-' ],   // 1,0  1,1  1,2
       [ '-', '-', '-' ],]; // 2,0  2,1  2,2


function initGame(gameID: string): GameState {
  return {
    gameID,
    player: nextPlayer('-'),
    board: emptyBoard,
    status: 'ongoing',
  }
}

export {
  type GameState,
  type Player,
  type Target,
  type Status,
  type Move,
  type Cell,
  makeMove,
  initGame
}
