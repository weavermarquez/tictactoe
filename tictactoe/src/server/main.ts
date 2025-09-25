//e.g server.js
import express from "express";
import ViteExpress from "vite-express";
import { makeMove, newGame, type GameState } from './tictactoe'

const app = express();
app.use(express.json())

let gamestate: GameState = newGame()
console.log("Reset game state!", gamestate.board)

app.get("/message", (_, res) => res.send("Hello from express! Blah"));

app.get("/game", (_, res) => res.json(gamestate));

app.post("/move", (req, res) => {
  const userMove = req.body;
  console.log("player", userMove.player, "moved at", userMove.target)
  gamestate = makeMove(gamestate, userMove.player, userMove.target)
  res.status(200).json(gamestate)
});


ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));
