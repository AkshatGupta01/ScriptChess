import { Action } from '@ngrx/store'

export const FETCH_PLAYER = "FETCH_PLAYER"
export const FETCH_PLAYER_SUCCESS = "FETCH_PLAYER_SUCCESS"
export const FETCH_PLAYER_FAILED = "FETCH_PLAYER_FAILED"

export const FETCH_PLAYERS = "FETCH_PLAYERS"
export const FETCH_PLAYERS_SUCCESS = "FETCH_PLAYERS_SUCCESS"
export const FETCH_PLAYERS_FAILED = "FETCH_PLAYERS_FAILED"


export const SEARCH_PLAYERS = "SEARCH_PLAYERS"
export const SEARCH_PLAYERS_SUCCESS = "SEARCH_PLAYERS_SUCCESS"
export const SEARCH_PLAYERS_FAILED = "SEARCH_PLAYERS_FAILED"


export class FetchPlayers implements Action {
    type : string = FETCH_PLAYERS
    constructor() {
    }
}

export class FetchPlayer implements Action {
    type : string = FETCH_PLAYER
    constructor(private playerId : string) {
    }
}

export class SearhPlayer implements Action {
    type : string = SEARCH_PLAYERS
    constructor(private name : string) {
    }
}


