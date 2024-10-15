import { Game, PieceAnalysis } from "./game"
import { Puzzle } from "./puzzle"

export interface BulkAnalyzerSummary {
  top5LossesInOpening: any[]
  pieceAccuracyData: any
  pieceAnalysisData: any
  endgameAnalysisSummaryData: any
  middleGameAnalysisSummaryData: any
  openingAnalysisSummaryData: any
  totalMistakes : number
  totalBlunders : number
  totalOpeningMistakes : number
  totalMiddleGameMistakes : number
  totalEndgameMistakes : number
  totalOpeningBlunders : number
  totalMiddleGameBlunders : number
  totalEndgameBlunders : number
  openingLosses : any
  pieceMisUndertood : any
  knightAnalysis? : PieceAnalysis
  rookAnalysis? : PieceAnalysis
  bishopAnalysis? : PieceAnalysis
  queenAnalysis? : PieceAnalysis
  kingAnalysis? : PieceAnalysis
  pawnAnalysis? : PieceAnalysis
  whiteMiddleAdvantageLost? : number
  whiteEndAdvantageLost? : number
  blackMiddleAdvantageLost? : number
  blackEndAdvantageLost? : number
  missedWeaknesses? : any,
  practicePositions? : Puzzle[],
  fenMovesMap? : any
  games?: Game[]
  createdOn? : Date
  comment? : string
  insightName? : string
  id? : string

}
