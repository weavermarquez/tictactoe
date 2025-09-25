//e.g server.js
import crypto from "crypto"
import express from "express";
import ViteExpress from "vite-express";
import { makeMove, initGame, type GameState } from './tictactoe'

const app = express();
app.use(express.json())

let games: Map<string, GameState> = new Map()
const firstID = crypto.randomUUID()
games.set(firstID, initGame(firstID))
console.log("Generated game:", firstID, games.get(firstID)?.board)
console.log(games.get(firstID))

app.get("/message", (_, res) => res.send("Hello from express! Blah"));

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
    console.log("game", gameID, "player", player, "moved at", target)

    const newGamestate = makeMove(gamestate, player, target)
    res.status(200).json(newGamestate)
  }
});


ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));
