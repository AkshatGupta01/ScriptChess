import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { Tournament } from "src/app/models/tournament";
import { TournamentState } from "./tournaments.state";

const getError = (state: TournamentState) => (state != null ? state.error : null)
const getTournaments = (state: TournamentState) => (state != null ? state.tournaments : [])
const getCurrentTournament = (state: TournamentState) => (state != null ? state.currentTournament : null)
const getIsLoading = (state: TournamentState) => (state != null ? state.isLoading : false)

const selectTournamentState : MemoizedSelector<object, TournamentState> = createFeatureSelector('tournaments');

export const selectAllTournaments : MemoizedSelector<object, Tournament[]> = createSelector(selectTournamentState, getTournaments)
export const selectCurrentTournament : MemoizedSelector<object, Tournament> = createSelector(selectTournamentState, getCurrentTournament)
export const selectError : MemoizedSelector<object, any > = createSelector(selectTournamentState, getError)
export const selectIsLoading : MemoizedSelector<object, boolean> = createSelector(selectTournamentState, getIsLoading)
