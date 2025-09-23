import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1 id="title" className="font-bold underline">Tic Tac Toe</h1>
      </div>
      <div className="game">
        <div className="cells">
          <div className="rows">
            <div className="row1">
              <div className="cell">[]</div>
              <div className="cell">[]</div>
              <div className="cell">[]</div>
            </div>
            <div className="row2">
              <div className="cell">[]</div>
              <div className="cell">[]</div>
              <div className="cell">[]</div>
            </div>
            <div className="row3">
              <div className="cell">[]</div>
              <div className="cell">[]</div>
              <div className="cell">[]</div>
            </div>
          </div>
        </div>
      </div>
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
