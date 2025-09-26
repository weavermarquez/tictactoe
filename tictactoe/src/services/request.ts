import axios from 'axios'
import { type GameState, type Player, type Target} from '../server/tictactoe.ts'

const BASE_URL = 'http://localhost:3000';

async function getGame({queryKey}): Promise<GameState> {
  const [, gameID] = queryKey;
  return (await axios.get(BASE_URL.concat('/game?gameID=', gameID))).data
}


async function getGamesList(): Promise<Array<string>> {
  return (await axios.get(BASE_URL.concat('/games'))).data
}


async function postMove(newMove): Promise<GameState> {
  console.log("postmove", newMove)
  const {gameID, player, target} = newMove;
  return (await axios.post(BASE_URL.concat('/move'), newMove)).data
}

function postCreateGame(): Promise<string> {
  return axios.post(BASE_URL.concat('/create'))
    .then( res => res.data )
}

export default {
  getGame: getGame,
  postMove: postMove,
  createGame: postCreateGame,
  getGamesList: getGamesList
}
