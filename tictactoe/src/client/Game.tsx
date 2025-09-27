import { useState, useEffect } from 'react'
import { makeMove, type GameState } from '../server/tictactoe'
import Celebration from './Celebration.tsx'
import Square from './Square.tsx'
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import gameService from '../services/request'


function Game(props) {
  const queryClient = useQueryClient()

  let gamestate: GameState

  function pollInterval(): number | false {
    if (!gamestate)
      return false
    return gamestate.status == 'ongoing' ? 500 : false
  }

  const { isPending, error, data } = useQuery({
    queryKey: ['game', props.gameID],
    queryFn: gameService.getGame,
    refetchInterval: pollInterval
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

  gamestate = data as GameState

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
        <Celebration
          currentPlayer={gamestate.player}
          winner={gamestate.winner}
          status={gamestate.status} />
        <History />
      </div>
    </>
  )
}

export default Game
