import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'



function Game() {
  const [gamestate, setGamestate] = useState(null)

  return (
    <>
      <div id="game">
        <div id="cells">
          <div id="rows" className="flex-col">
            <div id="row1" className="flex">
              <div id="cell" className="w-33">[]</div>
              <div id="cell" className="w-33">[]</div>
              <div id="cell" className="w-33">[]</div>
            </div>
            <div id="row2" className="flex">
              <div id="cell" className="w-33">[]</div>
              <div id="cell" className="w-33">[]</div>
              <div id="cell" className="w-33">[]</div>
            </div>
            <div id="row3" className="flex">
              <div id="cell" className="w-33">[]</div>
              <div id="cell" className="w-33">[]</div>
              <div id="cell" className="w-33">[]</div>
            </div>
          </div>
        </div>
        <div id="status">Current Player: X</div>
      </div>
    </>
  )
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1 id="title" className="font-bold underline">Tic Tac Toe</h1>
      </div>
      <Game />

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
