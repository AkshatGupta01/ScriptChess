import { Player } from "./player"

export interface Endgame {
    id : string
    gameId : string
    fen : string
    whitePlayer : Player
    blackPlayer : Player
    result : string
    blackToMove : boolean
    moveCount : number
    year? : number
}
