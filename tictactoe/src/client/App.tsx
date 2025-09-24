import './App.css'
import { optimizeDeps } from 'vite'
import Game from './Game.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <>
      <div>
        <h1 id="title" className="font-bold underline">Tic Tac Toe</h1>
      </div>
      <QueryClientProvider client={queryClient}>
        <Game />
      </QueryClientProvider>
    </>
  )
}

export default App
