import crypto from "crypto"
import express from "express";
import ViteExpress from "vite-express";
import { makeMove, initGame, type GameState } from './tictactoe'
import dbService from '../services/db.ts'

const app = express();
app.use(express.json())

app.get("/games", async (_, res) => {
  let gamesList = await dbService.getGames()
  console.log("/games gamesList", gamesList)
  return res.send(gamesList)
});

app.post("/create", async (_, res) => {
  const newGameID = await dbService.makeNewGame()
  console.log('from /create', newGameID)
  return res.status(201).json({gameID: newGameID})
})

// Expects a query parameter /game?gameID=<uuid>
app.get("/game", async (req, res) => {
  const gameID: string = req.query.gameID

  if (!gameID) {
    return res.status(400).end()
    // Malformed Request
  }
  const returnedGameState = await dbService.getGameState(gameID)
  return res.json(returnedGameState)
});

// TODO Move
app.post("/move", async (req, res) => {
  const {gameID, player, target} = req.body;
  const oldGameState = await dbService.getGameState(gameID)
  if (oldGameState!.status != 'ongoing') {
    return res.status(403).end()
    // Forbidden
  }

  const returnedGameState = await dbService.addMove(gameID, player, target)

  return res.status(200).json(returnedGameState)
});


ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));
