import { TrainingAdapter, TrainingState } from './training.state';
import { TrainingReport } from "src/app/models/training";
import { BOT_PLAYED, GAME_REVIEWED, POSITION_QUIZ_COMPLETED, PUZZLE_COMPLETED, TRAINING_DOWNLOADED, TRAINING_SAVED } from "./training.action";
import { environment } from 'src/environments/environment';


let reportStr = localStorage.getItem("trainingReport")
let trainingReport : TrainingReport = null;
if(reportStr) {
  trainingReport = JSON.parse(reportStr);
}
let initialState : TrainingState = TrainingAdapter.getInitialState({
  report : trainingReport
})

export function trainingReducer(state : TrainingState = initialState, action : any) {
  switch(action["type"]) {
    case PUZZLE_COMPLETED:
      if(state.report.gameInsightDone) {
        let newState = {...state, report : {...state.report, puzzlesCompleted : state.report.puzzlesCompleted + 1}}
        let puzzle = action["puzzle"]
        if(!newState.report.completedPuzzles) {
          newState.report.completedPuzzles = []
        }
        switch(action["theme"]) {
          case "r":
            if(!newState.report.rookPuzzles) {
              newState.report.rookPuzzles = []
            }
            newState.report.rookPuzzles = [...newState.report.rookPuzzles, puzzle]
            break
          case "n":
            if(!newState.report.knightPuzzles) {
              newState.report.knightPuzzles = []
            }
            newState.report.knightPuzzles = [...newState.report.knightPuzzles, puzzle]
            break
          case "b":
            if(!newState.report.bishopPuzzles) {
              newState.report.bishopPuzzles = []
            }
            newState.report.bishopPuzzles = [...newState.report.bishopPuzzles, puzzle]
            break
          case "q":
            if(!newState.report.queenPuzzles) {
              newState.report.queenPuzzles = []
            }
            newState.report.queenPuzzles = [...newState.report.queenPuzzles, puzzle]
            break
          case "All pieces":
            if(!newState.report.allPiecesPuzzle) {
              newState.report.allPiecesPuzzle = []
            }
            newState.report.allPiecesPuzzle = [...newState.report.allPiecesPuzzle, puzzle]
            break
        }
        newState.report.completedPuzzles = [...newState.report.completedPuzzles, puzzle]
        return {
          ...newState
        }
      } else {
        return {
          ...state
        }
      }


    case POSITION_QUIZ_COMPLETED:
      if(state.report.gameInsightDone) {
        let newState = {...state, report : {...state.report, positionQuizesCompleted : state.report.positionQuizesCompleted + 1}}
        let position = action["position"]
        if(!newState.report.completedPositions) {
          newState.report.completedPositions = []
        }
        newState.report.completedPositions = [...newState.report.completedPositions, position]
        return {
          ...newState
        }
      } else {
        return {
          ...state
        }
      }

    case BOT_PLAYED:
      if(state.report.gameInsightDone) {
        let newState = {...state, report : {...state.report, botsGames : state.report.botsGames + 1}}
        return {
          ...newState
        }
      } else {
        return {
          ...state
        }
      }

    case GAME_REVIEWED:
      if(state.report.gameInsightDone) {
        let newState = {...state, report : {...state.report, gamesReviewCompleted : state.report.gamesReviewCompleted + 1}}
        newState.report.reviewFullGames.forEach(g=> {
          if(g.gameId == action["gameID"]) {
            g.reviewed = true;
          }
        })
        if(!newState.report.analyzedGames) {
          newState.report.analyzedGames = []
        }
        newState.report.analyzedGames = [...newState.report.analyzedGames, action["analyzedGame"]]
        return {
          ...newState
        }
      } else {
        return {
          ...state
        }
      }

    case TRAINING_DOWNLOADED:
      let newState = {...state}
      newState.report = action["report"]
      return {
        ...newState
      }

    default:
          return {
              ...state
          }
  }
}
