import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { eq, asc } from 'drizzle-orm';
import { tabGames, tabMoves } from '../db/schema';
// import * as schema from '../db/schema';
const schema = {tabGames, tabMoves}

import { type GameState, type Player, type Target, initGame, makeMove } from '../server/tictactoe';
import crypto from "crypto"

const connectionString = process.env.DATABASE_URL!

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false })
export const db = drizzle({ client, schema });

function prepareNewEntry(): typeof tabGames.$inferInsert  {
  const historyList: Move[] = []
  return {
    gameID: crypto.randomUUID(),
    player: 'X',
    status: 'ongoing',
    board: [['-','-','-'],['-','-','-'],['-','-','-']],
  }
}

function addJunkData () {
  const newEntry = { ...prepareNewEntry() }
  Promise.resolve(db.insert(tabGames).values(newEntry))
}

async function getGames() {
  return await db.select({gameID: tabGames.gameID}).from(tabGames)
}

async function makeNewGame(): Promise<string> {
  const newEntry = { ...prepareNewEntry() }
  const returnedEntry = await db.insert(tabGames).values(newEntry)
    .returning({ gameID: tabGames.gameID });
  return returnedEntry[0].gameID
}

async function getGameState(gameID: string){
  return await db.query.tabGames.findFirst({
    where: eq(tabGames.gameID, gameID)
  })
}

async function getMoveHistory(gameID: string){
  return await db.query.tabMoves.findMany({
    where: eq(tabMoves.gameID, gameID),
    orderBy: [asc(tabMoves.moveNumber)],
  })
}


type Move = {id: number, player: Player, target: Target}
async function addMove(gameID: string, player: Player, target: Target){

  const oldMoveHistory = await getMoveHistory(gameID)
  const oldGameState = await getGameState(gameID)
  if (oldGameState?.status != 'ongoing') {
    return oldGameState
  }

  await db.insert(tabMoves).values({
    gameID: gameID,
    player: player,
    target: target
  })

  // Add a move to DB
  // update gamestate on DB
  // const gamestate = games.get(gameID)!

  // const newGameState = makeMove({
  //   ...oldGameState,
  //   history: oldMoveHistory.map( (oldMove) => {
  //     return {
  //       id: oldMove.moveNumber,
  //       player: oldMove.player,
  //       target: oldMove.target,
  //     }
  //   }),
  // }, player, target)

  const updatedDBGameState = await db.update(tabGames)
  .set({ ...newGameState })
  .where(eq(users.name, 'Dan'))
  .returning({ updatedId: users.id });

  return await getGameState(gameID)
  // toGameState(updatedDBGameState)

}


function gameStateToDB(gs: GameState): typeof tabGames.$inferInsert {
  const gameData: typeof tabGames.$inferInsert = {
    gameID: gs.gameID,
    player: gs.player,
    status: gs.status,
    winner: gs.winner,
    board: gs.board,
    createdAt: null,
    updatedAt: null,
  }

  return gameData
}

async function gameTest() {
  const initialGameStateAsDB: typeof tabGames.$inferInsert = {
    gameID: firstGameID,
    currentPlayer: 'X',
    status: 'ongoing',
    board: [['-','-','-'],['-','-','-'],['-','-','-']],
    winner: null,
    // createdAt: null,
    // updatedAt: null,
  }

  const game = initialGameStateAsDB

  await db.insert(tabGames).values(game);
  console.log('New game created!')

  let games = await db.select().from(tabGames);
  console.log('Getting all games from the database: ', games)
  games.map( g => {console.log('board', g.board)})

  await db
    .update(tabGames)
    .set({
      board: [['-','X','-'],['-','-','-'],['-','-','-']],
      currentPlayer: 'O',
    })
    .where(eq(tabGames.gameID, firstGameID));
  console.log('Game info updated!')


  games = await db.select().from(tabGames);
  console.log('Getting all games from the database: ', games)
  games.map( g => {console.log('board', g.board)})

  await db.delete(tabGames).where(eq(tabGames.gameID, firstGameID));
  console.log('Game deleted!')
}

export default {
  getGames: getGames,
  makeNewGame: makeNewGame,
  getGameState: getGameState
}
