import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { eq } from 'drizzle-orm';
import { tabGames, tabMoves } from '../db/schema';

import { type GameState, initGame, makeMove } from '../server/tictactoe';
import crypto from "crypto"

const connectionString = process.env.DATABASE_URL!

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client);

const initialGameState: GameState = {
  // gameID: null,
  player: "X",
  board: [['-','-','-'],['-','-','-'],['-','-','-']],
  status: {status: 'ongoing'},
  history: []
}


function prepareNewEntry(): typeof tabGames.$inferInsert  {
  return {
    gameID: crypto.randomUUID(),
    currentPlayer: 'X',
    status: 'ongoing',
    board: [['-','-','-'],['-','-','-'],['-','-','-']],
    winner: null,
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
    .returning({gameID: tabGames.gameID})
  return returnedEntry[0].gameID
}

async function getGameState(gameID: string){
  // if (await db.$count(tabGames, eq(tabGames.gameID, gameID))) <= 0 {
  //   return false
  // }
  const gamestate = await db.select().from(tabGames).where(eq(tabGames.gameID, gameID))
  console.log("got gamestate", gamestate[0])
  return gamestate[0]
}

function gameStateToDB(gs: GameState): typeof tabGames.$inferInsert {
  const gameData: typeof tabGames.$inferInsert = {
    gameID: gs.gameID,
    currentPlayer: gs.player,
    status: gs.status.type,
    winner: gs.status.type == 'winner' ? gs.status.player : null,
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



async function userTest () {
  const user: typeof usersTable.$inferInsert = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
  };

  await db.insert(usersTable).values(user);
  console.log('New user created!')

  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users)
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  await db
    .update(usersTable)
    .set({
      age: 31,
    })
    .where(eq(usersTable.email, user.email));
  console.log('User info updated!')

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log('User deleted!')
}

export default {
  getGames: getGames,
  makeNewGame: makeNewGame,
  getGameState: getGameState
}
