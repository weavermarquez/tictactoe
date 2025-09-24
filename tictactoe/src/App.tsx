import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { makeMove, newGame, type GameState } from './tictactoe'
import { optimizeDeps } from 'vite'

function Square(props) {
  return (
    <div
      className='square w-33 h-13 p-10'
      onClick={props.onSquareClick} >
      {props.value}
    </div>
  )
}

function Celebration(props) {
  const status = props.status
  const currentPlayer = props.currentPlayer
  const gameComplete = props.status.type == 'ongoing'
  return (
    <>
      <div id="status">{
        (() => {
          switch (status.type) {
            case 'ongoing':
              return `Your move, player ${currentPlayer}`
          break
            case 'draw':
              return "Hey, a draw! Let's say you both won. 🤗"
          break
            case 'winner':
              return `🎉 Congratulations, player ${status.player}! 🎉`
          }
        })()
        }
      </div>
    </>
  )
}

function Game() {
  const [gamestate, setGamestate] = useState(newGame())
  const player = gamestate.player

  // useEffect(() => {
  //   console.log("Effect gamestate", gamestate)
  //   setGamestate(newBoard)
  // }, [])

  function handleClick(row: number, col: number) {
    setGamestate(makeMove(gamestate, player, {row, col}))
  }

  return (
    <>
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
        <Celebration currentPlayer = {gamestate.player} status={gamestate.status} />
        <ol type='A'>
          { gamestate.history.map(e =>
            <li key={e.id}>{e.id}. Player {e.player} on {e.target.row},{e.target.col}</li>) }
        </ol>
      </div>
    </>
  )
}

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
