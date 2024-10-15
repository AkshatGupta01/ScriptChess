import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { GameCollection } from "src/app/models/game-collection";
import { GameCollectionState } from "./collections.state";

const getError = (state: GameCollectionState) => (state != null ? state.error : null)
const getGameCollections = (state: GameCollectionState) => (state != null ? state.collections : [])
const getCurrentGameCollection = (state: GameCollectionState) => (state != null ? state.currentCollection : null)
const getIsLoading = (state: GameCollectionState) => (state != null ? state.isLoading : false)

const selectGameCollectionState : MemoizedSelector<object, GameCollectionState> = createFeatureSelector('gameCollections');

export const selectAllGameCollections : MemoizedSelector<object, GameCollection[]> = createSelector(selectGameCollectionState, getGameCollections)
export const selectCurrentGameCollection : MemoizedSelector<object, GameCollection> = createSelector(selectGameCollectionState, getCurrentGameCollection)
export const selectError : MemoizedSelector<object, any > = createSelector(selectGameCollectionState, getError)
export const selectIsLoading : MemoizedSelector<object, boolean> = createSelector(selectGameCollectionState, getIsLoading)