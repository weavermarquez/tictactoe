import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { eq, asc, sql } from 'drizzle-orm';
import { tabGames, tabMoves } from '../db/schema';
// import * as schema from '../db/schema';
const schema = {tabGames, tabMoves}

import { type GameState, type Player, type Move, type Target, initGame, makeMove } from '../server/tictactoe';
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

function prepareNewMove(gameID: string, player: Player, target: Target): typeof tabMoves.$inferInsert  {
  return {gameID, player, target}
}

function addJunkData () {
  const newEntry = { ...prepareNewEntry() }
  db.insert(tabGames).values(newEntry).then(() => {console.log('added junk')})
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
    orderBy: [asc(tabMoves.moveCount)],
  })
}

async function addMove(gameID: string, player: Player, target: Target): GameState {
  const oldGameState = await getGameState(gameID)

  const newGameState = makeMove({...oldGameState} as GameState, player, target)
  if (newGameState == oldGameState) {
    return oldGameState as GameState
  }
  else {
    await db.insert(tabMoves).values({
      gameID: gameID,
      player: player,
      target: target
    })

    await db.update(tabGames)
      .set({ ...newGameState,
        updatedAt: sql`NOW()`
      })
      .where(eq(tabGames.gameID, gameID))

    return newGameState

  }
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
  getGames,
  makeNewGame,
  getGameState,
  addMove
}
