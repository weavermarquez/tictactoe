import axios from 'axios'
import { type GameState, type Player, type Target} from '../server/tictactoe.ts'

const BASE_URL = 'http://localhost:3000';

async function getGame({queryKey}): Promise<GameState> {
  const [, gameID] = queryKey;
  const gamestate = (await axios.get(BASE_URL.concat('/game?gameID=', gameID))).data
  return gamestate
}


async function getGamesList(): Promise<Array<string>> {
  return (await axios.get(BASE_URL.concat('/games'))).data
}


async function postMove(newMove): Promise<GameState> {
  const {gameID, player, target} = newMove;
  return (await axios.post(BASE_URL.concat('/move'), newMove)).data
}

async function getMovesList({queryKey}): Promise<Move[]> {
  const [, gameID] = queryKey;
  const moveList = (await axios.get(BASE_URL.concat('/moves?gameID=', gameID))).data
  return moveList
}

function postCreateGame(): Promise<string> {
  return axios.post(BASE_URL.concat('/create'))
    .then( res => res.data[0] )
}

export default {
  getGame: getGame,
  postMove: postMove,
  createGame: postCreateGame,
  getMovesList: getMovesList,
  getGamesList: getGamesList
}
