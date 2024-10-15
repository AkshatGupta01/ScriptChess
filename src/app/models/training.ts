import { float } from "aws-sdk/clients/cloudfront"
import { Game } from "./game"
import { Puzzle } from "./puzzle"
import { AnalysisStorageSchema } from "./storage-models"

export interface TrainingReport {
  startedOn? : Date
  puzzlesCompleted? : number
  positionQuizesCompleted? : number
  botsGames? : number
  minBotsELOToPlayAgainst? : number
  maxBotsELOToPlayAgainst? : number
  gameInsightDone? : boolean
  gamesReviewCompleted? : number
  maxPuzzleCount? : number
  maxPositionQuizeToComplete? : number
  botsGamesToBePlayed? : number
  gamesReviewsToComplete? : number
  misplayedPositions? : Puzzle[]
  pieceAccuracies? : any
  openingsToStudy? : any[]
  currentAvgRating? : number
  targetRating? : number
  reviewFullGames? : Game[]
  completed? : boolean
  completedPuzzles? : Puzzle[]
  completedPositions? : CompletedPosition[]
  puzzleCompletionReport? : PuzzleCompletionReport
  analyzedGames? : AnalysisStorageSchema[]
  bishopPuzzles? : Puzzle[]
  knightPuzzles? : Puzzle[]
  rookPuzzles? : Puzzle[]
  queenPuzzles? : Puzzle[]
  allPiecesPuzzle? : Puzzle[]
  positionAnalysisAccuracies? : float
  reviewedGameByOpening? : GamesPerOpening[]
  completedOn? : number
  positionalQuizSolved? : number,
  openingAnalysisSummaryData? : any
  middleGameAnalysisSummaryData? : any
  endgameAnalysisSummaryData? : any,
  whiteAdvantageLostData? :any
  blackAdvantageLostData? :any
  missedWeaknesses? : any,
  saved? : boolean
  id? : string
  owner? : string
}

export interface CompletedPosition {
  fen? : string
  solved? : boolean
}

export interface PuzzleCompletionReport {
  accuracy? : float,
  attemptPerPuzzles? : float
  failedToSolve? : number
  pawnPuzzleAccuracy? : float
  bishopsPuzzleAccuracy? : float
  knightPuzzleAccuracy? : float
  queenPuzzleAccuracy? : float
  rookPuzzleAccuracy? : float
  allPiecePuzzleAccuracy? : float
  attemptPerRookPuzzles? : float
  attemptPerKnightPuzzles? : float
  attemptPerBishopPuzzles? : float
  attemptPerQueenPuzzles? : float
  attemptPerAllPuzzles? : float
}

export interface GamesPerOpening {
  eco : string
  name : string
  game : Game
  playAs : string
}


