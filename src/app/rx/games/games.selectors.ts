import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { ECO, EcoModel } from "src/app/models/eco";
import { Game } from "src/app/models/game";
import { GameState } from "./games.state";

const getError = (state: GameState) => (state != null ? state.error : null)
const getGames = (state: GameState) => (state != null ? state.games : [])
const getCurrentGame = (state: GameState) => (state != null ? state.currentGame : null)
const getIsLoading = (state: GameState) => (state != null ? state.isLoading : false)
const getOpenings = (state: GameState) => (state != null ? state.ecos : [])
const getOpening = (state: GameState) => (state != null ? state.currentOpening : null)
const getMoves = (state: GameState) => (state != null ? state.moves : null)
const getTopOpenings = (state: GameState) => (state != null ? state.ecosWithGame : null)
const getMovesForPostionFromWeeklyGames = (state: GameState) => (state != null ? state.weeklyGameMoves : null)
const getState = (state: GameState) => state


const selectGameState : MemoizedSelector<object, GameState> = createFeatureSelector('games');

export const selectAllGames : MemoizedSelector<object, Game[]> = createSelector(selectGameState, getGames)
export const selectCurrentGame : MemoizedSelector<object, Game> = createSelector(selectGameState, getCurrentGame)
export const selectError : MemoizedSelector<object, any > = createSelector(selectGameState, getError)
export const selectIsLoading : MemoizedSelector<object, boolean> = createSelector(selectGameState, getIsLoading)
export const selectOpenings : MemoizedSelector<object, EcoModel[]> = createSelector(selectGameState, getOpenings)
export const selectTopOpenings : MemoizedSelector<object, ECO[]> = createSelector(selectGameState, getTopOpenings)
export const selectOpening : MemoizedSelector<object, EcoModel> = createSelector(selectGameState, getOpening)
export const selectMoves : MemoizedSelector<object, any[]> = createSelector(selectGameState, getMoves)
export const selectMovesFromWeeklygames : MemoizedSelector<object, any[]> = createSelector(selectGameState, getMovesForPostionFromWeeklyGames)
export const selectState : MemoizedSelector<object, GameState> = createSelector(selectGameState, getState)