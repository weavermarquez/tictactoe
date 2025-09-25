//e.g server.js
import crypto from "crypto"
import express from "express";
import ViteExpress from "vite-express";
import { makeMove, initGame, type GameState } from './tictactoe'

const app = express();
app.use(express.json())

let gamestate: GameState = initGame()
console.log("Reset game state!", gamestate.board)
console.log("Generated an ID:", crypto.randomUUID())

app.get("/message", (_, res) => res.send("Hello from express! Blah"));

app.get("/game", (_, res) => res.json(gamestate));

app.post("/move", (req, res) => {
  const userMove = req.body;
  console.log("player", userMove.player, "moved at", userMove.target)
  gamestate = makeMove(gamestate, userMove.player, userMove.target)
  res.status(200).json(gamestate)
});


ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));
