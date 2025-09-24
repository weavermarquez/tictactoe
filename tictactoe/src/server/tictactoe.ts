type Player = 'X' | 'O' | '-';
type Board = Array<Array<Player>>

type Target = {row: number, col: number}
type Move = {id: number, player: Player, target: Target,}

type GameState = {
  player: Player,
  board: Board
  status: WinState
  history: Array<Move>
}

type WinState = {type: 'winner', player: Player} | {type: 'draw'} | {type: 'ongoing'}


function nextPlayer (player: Player): Player {
  switch (player) {
    case 'X': return 'O'

    case 'O': return 'X'

    default: return 'X'
  }
}

function nextId(game: GameState): number {
  return game.history.length + 1
}

function cell(board: Board, coord: Target): Player {
  return board[coord.row][coord.col]
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


function detectWinner(board: Board, history: Array<Move>): WinState {
  const MAX_LENGTH = 9

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

  function allEqual (arr: Player[]) {return arr.every(val => val === arr[0])}
  const winPattern = patterns.find( pattern => (allEqual(pattern) && pattern[0] !== '-'))

  if (winPattern) {
    console.log("Found a winner!", winPattern[0])
    return {type: 'winner', player: winPattern[0]}
  } else if (history.length == MAX_LENGTH) {
    return {type: 'draw'}
  } else {
    return {type: 'ongoing'}
  }
}

function makeMove(game: GameState, player: Player, target: Target): GameState {
  const MAX_HISTORY = 9

  if (game.status.type == 'winner'){
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
  if (game.player != player && game.history.length < MAX_HISTORY){
    console.log('ERROR: Wrong Player!')
    // what to do? Reset game? return newGame()?
  }

  const currentMove: Move = {id: nextId(game), player, target}

  const newBoard = updateBoard(game.board, player, target)
  const newHistory = [...game.history, currentMove]
  const newWinState = detectWinner(newBoard, newHistory)

  const nextGameState: GameState = {
    player: nextPlayer(game.player),
    board: updateBoard(game.board, player, target),
    status: newWinState,
    history: [...game.history, currentMove]
  }
  return nextGameState
}

const emptyBoard: Board =
      [[ '-', '-', '-' ],   // 0,0  0,1  0,2
       [ '-', '-', '-' ],   // 1,0  1,1  1,2
       [ '-', '-', '-' ],]; // 2,0  2,1  2,2


function newGame(): GameState {
  return {
    player: nextPlayer('-'),
    board: emptyBoard,
    status: {type: 'ongoing'},
    history: []
  }
}

export { type GameState, makeMove, newGame }
