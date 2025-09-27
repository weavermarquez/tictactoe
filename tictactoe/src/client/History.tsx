import { type Move } from '../server/tictactoe'
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import gameService from '../services/request'

function History(props) {
  let moveList: Move[]

  const { isPending, error, data } = useQuery({
    queryKey: ['moves', props.gameID],
    queryFn: gameService.getMovesList
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  moveList = data as Move[]

  if (!history){
    return <></>
  }
  return (
    <>
      <ol type='A'>
      { moveList.map(e =>
        <li key={e.moveCount}>{e.moveCount}. Player {e.player} on {e.target.row},{e.target.col}</li>) }
      </ol>
    </>
  )
}

export default History
