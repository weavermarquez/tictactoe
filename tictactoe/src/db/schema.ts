import { pgTable, pgEnum, integer, uuid, jsonb, timestamp, char, smallint } from "drizzle-orm/pg-core"
import { type Player, type WinState, type Move, type Target } from '../server/tictactoe'

export const gameStatusEnum = pgEnum('status', ['ongoing', 'winner', 'draw']);

export const gamesTable = pgTable("games", {
  gameID: uuid().primaryKey().defaultRandom(),
  currentPlayer: char({ enum: ["X", "O"] }),
  status: gameStatusEnum(),
  winner: char({ enum: ['X', 'O'] }),
  board: jsonb().$type<Player[][]>(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
})

export const movesTable = pgTable("moves", {
  gameID: uuid().references(() => gamesTable.gameID),
  moveNumber: smallint(),
  player: char({ enum: ['X', 'O'] }),
  target: jsonb().$type<Target>(),
  createdAt: timestamp().defaultNow()
})

