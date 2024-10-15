import { Move } from "./move"

export interface GameStorageSchema {
    white : string
    black : string
    pgn : string
    date : string
    eco ? :string
    id? : number
    result? : string
    moveCount? : number

}

export interface PositionAnalysisStorageSchema {
    fen : string,
    eval : string
}

export interface AnalysisStorageSchema {
    pgn : string
    moves : Move[]
    date : string
    eco : string
    id? : number,
    md5? : string,
    name? : string,
    notes? : string
}
