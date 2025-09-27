import { pgTable, pgEnum, integer, primaryKey,
  uuid, jsonb, timestamp, char, smallserial } from "drizzle-orm/pg-core"
import { type Player, type WinState, type Move, type Cell, type Target } from '../server/tictactoe'

export const gameStatusEnum = pgEnum('status', ['ongoing', 'winner', 'draw']);

export const tabGames = pgTable("tabGames", {
  gameID: uuid().primaryKey().defaultRandom(),
  player: char({ enum: ["X", "O"] }).notNull(),
  status: gameStatusEnum().notNull(),
  winner: char({ enum: ['X', 'O'] }),
  board: jsonb().$type<Cell[][]>().notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
})

export const tabMoves = pgTable("tabMoves", {
  gameID: uuid().notNull().references(() => tabGames.gameID),
  moveCount: smallserial(),
  player: char({ enum: ['X', 'O'] }).notNull(),
  target: jsonb().$type<Target>().notNull(),
  createdAt: timestamp().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.gameID, table.moveCount] }),
])
