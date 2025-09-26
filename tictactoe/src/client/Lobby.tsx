import { optimizeDeps } from 'vite'
import Game from './Game.tsx'
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import gameService from '../services/request'

function Lobby(props) {
  const queryClient = useQueryClient()

  console.log(props['navigate'])
  // props.navigate('blahblah')

  const { isPending, error, data } = useQuery({
    queryKey: ['gamesList'],
    queryFn: gameService.getGame
  })

  const mutation = useMutation({
    mutationFn: gameService.postMove,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['gamesList'] })
    },
  })

  function makeNewGame(): string {
    const newGameID = gameService.createGame()
  }

  return (
    <>
      <div>
        <h1 id="title" className="font-bold underline">Tic Tac Toe</h1>
      </div>

      <div>
        <ol>
          <li>One</li>
          <li>Two</li>
        </ol>
      <button 
      className='w-33 h-13 p-10'
      onClick={gameService.createGame}
      >
        Make a new Game?
      </button>


      </div>
    </>
  )
}

export default Lobby