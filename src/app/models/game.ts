
import { Move } from "./move";
import { Player } from "./player";

export interface Game {
    gameId? : string
    id? :string
    pgn? : string
    event? : string
    site? : string
    round? : number
    result? : string
    date? : Date | null
    whitePlayer? : Player
    blackPlayer? : Player
    categories? : string[] | undefined
    sacrifices? :string[] | undefined
    otherDetails? : any
    moves? : Move[]
    moveCount? : number
    tags? : string[]
    opening? : string
    analyzingState? : string
    progress? : number
    whiteAnalysis? : Analysis
    blackAnalysis? : Analysis
    md5? : string
    eco? : string
    analysisId? : string
    knightAnalysis? : PieceAnalysis
    rookAnalysis? : PieceAnalysis
    bishopAnalysis? : PieceAnalysis
    queenAnalysis? : PieceAnalysis
    kingAnalysis? : PieceAnalysis
    pawnAnalysis? : PieceAnalysis
    pieceMisUndertood? : any
    storageId? : number
    reviewed? : boolean
}

export interface Analysis {
    BRILLIANT : number
    GOOD_MOVE : number
    BEST : number
    BOOK_MOVE : number
    DUBIOUS : number
    MISTAKE : number
    BLUNDER : number
    MIDDLE_ADVANTAGE_LOST : number
    END_ADVANTAGE_LOST : number
}

export interface PieceAnalysis {
  piece : string
  total : number
  mistakes : number
}
