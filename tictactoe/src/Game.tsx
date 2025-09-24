import { useState, useEffect } from 'react'
import { makeMove, newGame, type GameState } from './tictactoe'
import Celebration from './Celebration.tsx'
import Square from './Square.tsx'

function Game() {
  const [gamestate, setGamestate] = useState(newGame())
  const player = gamestate.player

  function handleClick(row: number, col: number) {
    setGamestate(makeMove(gamestate, player, {row, col}))
  }

  return (
    <>
      <div id="game">
        <div id="board">
          <div id='rows' className='flex-col'>
            { gamestate.board.map((row, r) =>
              <div key={'row'.concat(String(r))} className='flex'>
                { gamestate.board[r].map((col, c) =>
                  <Square value={col}
                    key={''.concat(r,c)}
                    r={r} c={c}
                      onSquareClick={ () => handleClick(r, c)}
                    />)}
              </div>
            ) }
          </div>
        </div>
        <Celebration currentPlayer = {gamestate.player} status={gamestate.status} />
        <ol type='A'>
          { gamestate.history.map(e =>
            <li key={e.id}>{e.id}. Player {e.player} on {e.target.row},{e.target.col}</li>) }
        </ol>
      </div>
    </>
  )
}

export default Game
