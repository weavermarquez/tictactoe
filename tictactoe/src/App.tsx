import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { makeMove, newGame, type GameState } from './tictactoe'

function Game() {
  // const [gamestate, setGamestate] = useState(null)

  // useEffect(() => {
  //   const currentPlayer = "O"
  //   const target = [1,1]
  //   const newBoard = makeMove(gamestate, player, target)
  //   setGamestate(newBoard)
  // }, [])
  const gamestate = newGame()
  const newPlayer = "O"
  const target = {row: 1, col: 1}
  const newBoard = makeMove(gamestate, newPlayer, target)

  return (
    <>
      <div id="game">
        <div id="board">
          <div id="rows" className="flex-col">
            <div id="rowA" className="flex">
              <div id="A0" className="w-33">[]</div>
              <div id="A1" className="w-33">[]</div>
              <div id="A2" className="w-33">[]</div>
            </div>
            <div id="rowB" className="flex">
              <div id="B0" className="w-33">[]</div>
              <div id="B1" className="w-33">[]</div>
              <div id="B2" className="w-33">[]</div>
            </div>
            <div id="rowC" className="flex">
              <div id="C0" className="w-33">[]</div>
              <div id="C1" className="w-33">[]</div>
              <div id="C2" className="w-33">[]</div>
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
