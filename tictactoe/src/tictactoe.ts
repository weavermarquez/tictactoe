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


function nextPlayer (game: GameState): Player {
  switch (game.player) {
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

function cell(board: Board, coord: Target): Player{
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

function matchVertical(board: Board): [boolean, winner] {
  // there exists a winner
  // transpose?
  //
  // 0,0  1,0  2,0
  //
  // 0,1  1,1  2,1
  //
  // 0,2  1,2  2,2
}
function matchHorizontal(): [boolean, winner] {
  // if any of the rows are the same value AND that value is not '-'

}
function matchDiagonal(): [boolean, winner] {
  // topleft/bottomright
  // 0,0  1,1  2,2
  //
  // topright/bottomleft
  // 0,2  1,1  2, 0


}

function detectWinner(board: Board): [boolean, winner] {
  // if history.length < 5 it's in progress.

  // cross won
  // circle won
  // draw :: all 9 positions are filled AND no winner above.
  //
}

function makeMove(game: GameState, player: Player, target: Target): GameState {
  console.log("player", player, "moved on", target)

  // validate the move: is target cell empty? is input player current player?
  if (cell(game.board, target) != '-') {
    console.log('ERROR: Board already populated!')
    // Probably just return the current gamestate.
    return game
  }
  if (game.player != player){
    console.log('ERROR: Wrong Player!')
  }

  const currentMove: Move = {id: nextId(game), player, target}

  const newBoard = updateBoard(game.board, player, target)

  // update status and check for winner
  // switch players
  const nextGameState: GameState = {
    player: nextPlayer(game),
    board: updateBoard(game.board, player, target),
    status: 'In progress', // TODO
    winner: '-',
    history: [...game.history, currentMove]
  }
  // return new GameState(state, transition)
  return game
}

const emptyBoard: Board =
      [[ '-', '-', '-' ],   // 0,0  0,1  0,2
       [ '-', '-', '-' ],   // 1,0  1,1  1,2
       [ '-', '-', '-' ],]; // 2,0  2,1  2,2


const testBoard: Board =
      [[ 'X', '-', '-' ],   // 0,0  0,1  0,2
       [ 'X', 'X', '-' ],   // 1,0  1,1  1,2
       [ '-', '-', '-' ],]; // 2,0  2,1  2,2

function newGame(): GameState {
  return {
    player: '-',
    board: emptyBoard,
    status: 'In progress',
    winner: '-',
    history: []
  }
}

export { type GameState, makeMove, newGame }
