import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { eq } from 'drizzle-orm';
import { tabGames, tabMoves } from '../db/schema';

import { type GameState } from '../server/tictactoe';

const connectionString = process.env.DATABASE_URL!

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client);

async function getKeys(): Promise<string[]> {
  // - Select id, status, current_player,
  // updated_at (for ordering). Maybe filter by status if you like.
  let games: {gameID: string} = await db.select({
    gameID: tabGames.gameID,
  }).from(tabGames)
  return games
}

  // let games: {
  //     gameID: string;
  //     currentPlayer: "X" | "O";
  //     status: "winner" | "draw" | "ongoing";
  //     winner: "X" | "O" | null;
  //     board: Cell[][];
  // }[]


const firstGameID: string = crypto.randomUUID()

const initialGameState = {
  gameID: firstGameID,
  player: "X",
  board: [['-','-','-'],['-','-','-'],['-','-','-']],
  status: {status: 'ongoing'},
  history: []
}

function gameStateToDB(gs: GameState): typeof gamesTable.$inferInsert {
  const gameData: typeof gamesTable.$inferInsert = {
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
  const initialGameStateAsDB: typeof gamesTable.$inferInsert = {
    gameID: firstGameID,
    currentPlayer: 'X',
    status: 'ongoing',
    board: [['-','-','-'],['-','-','-'],['-','-','-']],
    winner: null,
    // createdAt: null,
    // updatedAt: null,
  }

  const game = initialGameStateAsDB

  await db.insert(gamesTable).values(game);
  console.log('New game created!')

  let games = await db.select().from(gamesTable);
  console.log('Getting all games from the database: ', games)
  games.map( g => {console.log('board', g.board)})

  await db
    .update(gamesTable)
    .set({
      board: [['-','X','-'],['-','-','-'],['-','-','-']],
      currentPlayer: 'O',
    })
    .where(eq(gamesTable.gameID, firstGameID));
  console.log('Game info updated!')


  games = await db.select().from(gamesTable);
  console.log('Getting all games from the database: ', games)
  games.map( g => {console.log('board', g.board)})

  await db.delete(gamesTable).where(eq(gamesTable.gameID, firstGameID));
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
