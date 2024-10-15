import { ChessColors } from "./board.config"
import { PositionAnalysisForBothSide, PostionAnalysis } from "./weaknesses"

export interface Move {
    move : string
    moveNumber : number
    moveTime? : string | undefined
    timeTakenInSec? : number | undefined
    comment? : string | undefined
    followSequence?: string[]
    moveCat? : string
    fen? : string,
    bestMove? : string,
    eval? : string,
    bestEval? : string,
    sideMoves? : Move[],
    sideMovesArray? : Move[][],
    from? : string,
    to? : string,
    bFrom? : string, //best move from
    bTo? : string, //best move to
    candidateLines? : PrimaryLines
    isSideMove? : boolean
    parent?: Move
    next? : Move
    playedBy? : ChessColors
    prev? : Move
    playedBySelectedUser? : boolean //for multi game analyzer
    enpassent? : boolean
    analyticalStatement? : AnalyticalStatement,
    missedWeaknesses? : PostionAnalysis[]
    bothSideAnalysis? : PositionAnalysisForBothSide
}

export enum MoveCategory {
    BRILLIANT,
    GOOD_MOVE,
    BEST,
    BOOK_MOVE,
    DUBIOUS,
    MISTAKE,
    BLUNDER
}

export interface MoveDetails {
    move : string
    whiteWins : number
    blackWins : number
    draws : number
    count : number
    games? : any[]
    novalty? : boolean
    eval? : string
    playedBySelectedUser? : boolean
    bestMove? : string
}

export interface AnalyticalStatement {
  dialoge : string
  moveSequence : string[]
}

export class PrimaryLines {
    lines: PrimaryLine[] = []
    maxLines : 3
    depth : number
    linesMap = {}

    public setDepth(depth) {
        this.depth = depth;
    }

    public pushLine(primaryLine : PrimaryLine) {
        if(this.linesMap  && this.linesMap[primaryLine.depth]) {
          this.lines = this.lines.slice(0,1)
          this.lines.push(primaryLine);
        } else {
          if(this.lines.length == 3) {
            if(this.linesMap && this.linesMap[this.lines[0].depth]) {
              delete this.linesMap["this.lines[0].depth"]
            }
            this.lines = this.lines.slice(1,2)
            this.linesMap[primaryLine.depth] = "0"
          }
          this.lines.push(primaryLine);
        }
    }

    public getLines() : PrimaryLine[]{
        return this.lines;
    }
}

export class PrimaryLine {
    score : string
    moves : string[]
    depth : string
    constructor(score , moves, depth ="0") {
        this.score = score;
        this.moves = moves;
        this.depth = depth;
    }
}
