import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { Player } from "src/app/models/player";
import { PlayerState } from "./players.state";

const getError = (state: PlayerState) => (state != null ? state.error : null)
const getPlayers = (state: PlayerState) => (state != null ? state.players : [])
const getCurrentPlayer = (state: PlayerState) => (state != null ? state.currentPlayer : null)
const getIsLoading = (state: PlayerState) => (state != null ? state.isLoading : false)

const selectPlayerState : MemoizedSelector<object, PlayerState> = createFeatureSelector('players');

export const selectAllPlayers : MemoizedSelector<object, Player[]> = createSelector(selectPlayerState, getPlayers)
export const selectCurrentPlayer : MemoizedSelector<object, Player> = createSelector(selectPlayerState, getCurrentPlayer)
export const selectError : MemoizedSelector<object, any > = createSelector(selectPlayerState, getError)
export const selectIsLoading : MemoizedSelector<object, boolean> = createSelector(selectPlayerState, getIsLoading)