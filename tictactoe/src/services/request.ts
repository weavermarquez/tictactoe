import axios from 'axios'
import { type GameState, type Player, type Target} from '../server/tictactoe.ts'

const BASE_URL = 'http://localhost:3000';

function getGame(gameID: string): Promise<GameState> {
  return axios.get(BASE_URL.concat('/game?gameID=', gameID))
    .then( res => res.data )
}
async function getGameAlt(gameID: string): Promise<GameState> {
  return (await axios.get(BASE_URL
    .concat('/game?gameID=', gameID))).data
}

function postMove(newMove: {gameID: string, player: Player, target: Target}) {
  return axios.post(BASE_URL.concat('/move'), newMove)
}

function postCreateGame(): Promise<string> {
  return axios.post(BASE_URL.concat('/create'))
    .then( res => res.data )
}

export default {
  getGame: getGame,
  postMove: postMove,
  createGame: postCreateGame
}
