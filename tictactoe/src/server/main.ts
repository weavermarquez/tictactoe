//e.g server.js
import crypto from "crypto"
import express from "express";
import ViteExpress from "vite-express";
import { makeMove, initGame, type GameState } from './tictactoe'

const app = express();
app.use(express.json())

let games: Map<string, GameState> = new Map()

app.get("/message", (_, res) => res.send("Hello from express! Blah"));
app.get("/games", (_, res) => res.send([...games.keys()]));

app.post("/create", (_, res) => {
  const newID = crypto.randomUUID()
  if (games.has(newID)) {
    res.status(500).end() // The unthinkable has happened
  }
  console.log("Generated game:", newID, games.get(newID)?.board)

  games.set(newID, initGame(newID))
  return res.status(201).json({gameID: newID})
})

// Expects a query parameter /game?gameID=<uuid>
app.get("/game", (req, res) => {
  const gameID: string = req.query.gameID

  if (!gameID) {
    return res.status(400).end()
    // Malformed Request
  }
  if (!games.has(gameID)) {
    return res.status(404).end()
    // Game does not exist
  }
  return res.json(games.get(gameID))
});

app.post("/move", (req, res) => {
  const {gameID, player, target} = req.body;

  if (!games.has(gameID)) {
    return res.status(404).end()
    // Game does not exist
  } else {
    const gamestate = games.get(gameID)

    const newGamestate = makeMove(gamestate, player, target)
    games.set(gameID, newGamestate)
    res.status(200).json(newGamestate)
  }
});


ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));
