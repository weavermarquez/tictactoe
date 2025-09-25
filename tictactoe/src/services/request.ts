import axios from 'axios'
import { type GameState, type Player, type Target} from '../server/tictactoe.ts'

const BASE_URL = 'http://localhost:3000/';

function getGame(gameID: string): Promise<GameState> {
  return axios.get(BASE_URL.concat('game?=', gameID))
    .then( res => res.data )
}

function postMove(newMove: {player: Player, target: Target}) {
  return axios.post(BASE_URL.concat('move'), newMove)
}

export default {
  getGame: getGame,
  postMove: postMove
}
