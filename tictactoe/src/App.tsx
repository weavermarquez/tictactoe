import './App.css'
import { optimizeDeps } from 'vite'
import Game from './Game.tsx'


function App() {
  return (
    <>
      <div>
        <h1 id="title" className="font-bold underline">Tic Tac Toe</h1>
      </div>
      <Game />
    </>
  )
}

export default App
