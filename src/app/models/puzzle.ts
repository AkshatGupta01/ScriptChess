export interface Puzzle {
    puzzleId : string
    fen : string
    moves : string[]
    rating : number
    deviation : number
    popularity : number
    nbPlayed : number
    theme : string
    url : string
    opening : string
    eval? : string
    attempt? : number
    solved? :  boolean
}
