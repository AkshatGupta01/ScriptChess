import { Action } from '@ngrx/store'

export const FETCH_TOURNAMENT = "FETCH_TOURNAMENT"
export const FETCH_TOURNAMENT_SUCCESS = "FETCH_TOURNAMENT_SUCCESS"
export const FETCH_TOURNAMENT_FAILED = "FETCH_TOURNAMENT_FAILED"

export const FETCH_TOURNAMENTS = "FETCH_TOURNAMENTS"
export const FETCH_TOURNAMENTS_SUCCESS = "FETCH_TOURNAMENTS_SUCCESS"
export const FETCH_TOURNAMENTS_FAILED = "FETCH_TOURNAMENTS_FAILED"

export const SEARCH_TOURNAMENTS = "SEARCH_TOURNAMENTS"
export const SEARCH_TOURNAMENTS_SUCCESS = "SEARCH_TOURNAMENTS_SUCCESS"
export const SEARCH_TOURNAMENTS_FAILED = "SEARCH_TOURNAMENTS_FAILED"

export class FetchTournaments implements Action {
    type : string = FETCH_TOURNAMENTS
    constructor() {
    }
}

export class FetchTournament implements Action {
    type : string = FETCH_TOURNAMENT
    constructor(private tournamentId : string) {
    }
}

export class SearchTournaments implements Action {
    type : string = SEARCH_TOURNAMENTS
    constructor(private term : string) {
    }
}

