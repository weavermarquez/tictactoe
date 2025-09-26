import './App.css'
import { useState, useEffect } from 'react'
import { optimizeDeps } from 'vite'
import Game from './Game.tsx'
import Lobby from './Lobby'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import gameService from '../services/request'

const queryClient = new QueryClient()

function App() {
  let [selectedGameID, setSelectedGameID] = useState('')

  function changeGameID(gameID: string) {
    setSelectedGameID(gameID)
  }

  return (
    <>
      <header>
        {
          selectedGameID ?
          <button onClick={(() => setSelectedGameID(''))}>Back to Lobby</button>
          : <h1 id="title" className="font-bold underline">Tic Tac Toe</h1>
        }
      </header>

      <QueryClientProvider client={queryClient}>
        {
          selectedGameID ?
          <Game navigate={changeGameID} 
            gameID = {selectedGameID} />
          : <Lobby navigate={changeGameID} />
        }
      </QueryClientProvider>
    </>
  )
}

export default App
