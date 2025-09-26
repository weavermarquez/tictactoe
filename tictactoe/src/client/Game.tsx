import { useState, useEffect } from 'react'
import { makeMove, type GameState } from '../server/tictactoe'
import Celebration from './Celebration.tsx'
import Square from './Square.tsx'
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import gameService from '../services/request'


function Game(props) {
  const queryClient = useQueryClient()

  const { isPending, error, data } = useQuery({
    queryKey: ['game', props.gameID],
    queryFn: gameService.getGame
  })

  const mutation = useMutation({
    mutationFn: gameService.postMove,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['game', props.gameID] })
    },
  })


  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  const gamestate = data as GameState

  function handleClick(row: number, col: number) {
    console.log("clicked on", row, col, gamestate.gameID)
    mutation.mutate({
      gameID: props.gameID,
      player: gamestate.player,
      target: {row: row, col: col}
    })
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
