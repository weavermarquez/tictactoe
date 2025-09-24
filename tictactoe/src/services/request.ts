import axios from 'axios'
import { type GameState, type Player, type Target} from '../server/tictactoe.ts'

const BASE_URL = 'http://localhost:3000/';

function getGame(): Promise<GameState> {
  return axios.get(BASE_URL.concat('game'))
    .then( res => res.data )
}


function postMove(player: Player, target: Target): Promise<GameState> {
  return axios.post(BASE_URL.concat('move'), {player, target})
  .then( res => res.data )
}

export default {
  getGame: getGame,
  postMove: postMove
}
