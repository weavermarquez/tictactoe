import { useState, useEffect } from 'react'
import { makeMove, newGame, type GameState } from '../server/tictactoe'
import Celebration from './Celebration.tsx'
import Square from './Square.tsx'
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import gameService from '../services/request'


const BASE_URL = 'http://localhost:3000/';

function Game() {
  const [gamestate, setGamestate] = useState(newGame())
  const player = gamestate.player

  useEffect(() => {
    gameService
      .getGame()
      .then( game => setGamestate(game) )
  }, [])

  function handleClick(row: number, col: number) {
    gameService
      .postMove(player, {row, col})
      .then( game => setGamestate(game) )
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
