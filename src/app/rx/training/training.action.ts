import { Action } from '@ngrx/store'
import { Puzzle } from 'src/app/models/puzzle'
import { AnalysisStorageSchema } from 'src/app/models/storage-models'
import { CompletedPosition, TrainingReport } from 'src/app/models/training'

export const PUZZLE_COMPLETED = "PUZZLE_COMPLETED"
export const POSITION_QUIZ_COMPLETED = "POSITION_QUIZ_COMPLETED"
export const BOT_PLAYED = "BOT_PLAYED"
export const GAME_REVIEWED = "GAME_REVIEWED"
export const INSIGHT_GENERATED = "INSIGHT_GENERATED"
export const TRAINING_SAVED = "TRAINING_SAVED"
export const TRAINING_UPDATED = "TRAINING_UPDATED"
export const TRAINING_SAVED_FAILED = "TRAINING_SAVED_FAILED"
export const TRAINING_DOWNLOADED = "TRAINING_DOWNLOADED"
export class PuzzleCompleted implements Action {
  type : string = PUZZLE_COMPLETED
  constructor(private puzzle : Puzzle,private theme : string){}
}


export class PositionQuizCompleted implements Action {
  type : string = POSITION_QUIZ_COMPLETED
  constructor(private position : CompletedPosition){}
}

export class BotPlayed implements Action {
  type : string = BOT_PLAYED
}

export class GameReviewed implements Action {
  type : string = GAME_REVIEWED
  constructor(private gameID : string,analyzedGame : AnalysisStorageSchema){}
}

export class InsightGenerated implements Action {
  type : string = INSIGHT_GENERATED
}

export class TrainingSaved implements Action {
  type : string = TRAINING_SAVED
}

export class TrainingSavedFailed implements Action {
  type : string = TRAINING_SAVED_FAILED
}

export class TrainingUpdated implements Action {
  type : string = TRAINING_UPDATED
}

export class TrainingDownloaded implements Action {
  type : string = TRAINING_DOWNLOADED
  constructor(private report : TrainingReport){}
}


