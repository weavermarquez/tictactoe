import { type Move } from '../server/tictactoe'
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import gameService from '../services/request'

function History(props) {
  let moveList: Move[]
  const gamestate = props.gamestate


  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  moveList = data as Move[]

  if (!history){
    return <></>
  }
  return (
      <>
        <button onClick={beginReplay()}>Replay Game</button>

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
          <QueryClientProvider client={queryClient}>
            <History
              gameID={gamestate.gameID} />
          </QueryClientProvider>
        </div>
      </>
  )
}

export default History
