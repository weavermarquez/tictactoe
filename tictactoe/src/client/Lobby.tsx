import { optimizeDeps } from 'vite'
import Game from './Game.tsx'
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import gameService from '../services/request'

function Lobby(props) {
  const queryClient = useQueryClient()


  const { isPending, error, data } = useQuery({
    queryKey: ['gamesList'],
    queryFn: gameService.getGamesList
  })

  const mutation = useMutation({
    mutationFn: gameService.createGame,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['gamesList'] })
    },
  })

  function handleClick() {
    mutation.mutate()
  }

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  // console.log(props['navigate'])
  // props.navigate('blahblah')

  const gamesList = data


  return (
    <>
      <div className='flex'>
        <button 
        className='w-33 h-13 p-10 align-middle'
        onClick={handleClick} >
          Make a new Game?
        </button>
        <ol>
          {
            gamesList.map(entry =>
            <li key={entry.gameID}>
              <div>
                {entry.gameID}
                <button onClick={(() => props.navigate(entry.gameID))}>
                Enter Game
              </button>
              </div>
            </li>)
          }
        </ol>
      </div>
    </>
  )
}

export default Lobby
