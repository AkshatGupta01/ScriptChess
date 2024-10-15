import { TrainingReport } from "src/app/models/training";
import { TrainingState } from "./training.state";
import { MemoizedSelector, createFeatureSelector, createSelector } from "@ngrx/store";

const getPuzzlesCompleted = (state: TrainingState) => (state != null ? state.report.puzzlesCompleted : 0)
const getTrainingReport = (state: TrainingState) => (state != null ? state.report : null)

const selectTrainingState : MemoizedSelector<object, TrainingState> = createFeatureSelector('training');

export const selectPuzzleCompleted : MemoizedSelector<object, number> = createSelector(selectTrainingState, getPuzzlesCompleted)
export const selectTrainingReport : MemoizedSelector<object, TrainingReport> = createSelector(selectTrainingState, getTrainingReport)
