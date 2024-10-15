import { Action } from '@ngrx/store'
import { GameSearchParams } from 'src/app/models/game-search-params'

export const FETCH_GAME = "FETCH_GAME"
export const FETCH_GAME_SUCCESS = "FETCH_GAME_SUCCESS"
export const FETCH_GAME_FAILED = "FETCH_GAME_FAILED"

export const FETCH_GAMES_OF_PLAYER = "FETCH_GAMES_OF_PLAYER"
export const FETCH_GAMES_OF_PLAYER_SUCCESS = "FETCH_GAMES_OF_PLAYER_SUCCESS"
export const FETCH_GAMES_OF_PLAYER_FAILED = "FETCH_GAMES_OF_PLAYER_FAILED"

export const FETCH_GAMES_OF_TOURNAMENT = "FETCH_GAMES_OF_TOURNAMENT"
export const FETCH_GAMES_OF_TOURNAMENT_SUCCESS = "FETCH_GAMES_OF_TOURNAMENT_SUCCESS"
export const FETCH_GAMES_OF_TOURNAMENT_FAILED = "FETCH_GAMES_OF_TOURNAMENT_FAILED"

export const FETCH_GAMES_OF_MOVES = "FETCH_GAMES_OF_MOVES"
export const FETCH_GAMES_OF_MOVES_SUCCESS = "FETCH_GAMES_OF_MOVES_SUCCESS"
export const FETCH_GAMES_OF_MOVES_FAILED = "FETCH_GAMES_OF_MOVES_FAILED"

export const FETCH_OPENINGS = "FETCH_OPENINGS"
export const FETCH_OPENINGS_SUCCESS = "FETCH_OPENINGS_SUCCESS"
export const FETCH_OPENINGS_FAILED = "FETCH_OPENINGS_FAILED"

export const FETCH_OPENING = "FETCH_OPENING"
export const FETCH_OPENING_SUCCESS = "FETCH_OPENING_SUCCESS"
export const FETCH_OPENING_FAILED = "FETCH_OPENING_FAILED"

export const FETCH_MOVES = "FETCH_MOVES"
export const FETCH_MOVES_SUCCESS = "FETCH_MOVES_SUCCESS"
export const FETCH_MOVES_FAILED = "FETCH_MOVES_FAILED"

export const SEARCH_GAMES = "SEARCH_GAMES"
export const SEARCH_GAMES_SUCCESS = "SEARCH_GAMES_SUCCESS"
export const SEARCH_GAMES_FAILED = "SEARCH_GAMES_FAILED"

export const SEARCH_OPENINGS = "SEARCH_OPENINGS"
export const SEARCH_OPENINGS_SUCCESS = "SEARCH_OPENINGS_SUCCESS"
export const SEARCH_OPENINGS_FAILED = "SEARCH_OPENINGS_FAILED"

export const SEARCH_GAMES_FROM_POSITION = "SEARCH_GAMES_FROM_POSITION"
export const SEARCH_GAMES_FROM_POSITION_SUCCESS = "SEARCH_GAMES_FROM_POSITION_SUCCESS"
export const SEARCH_GAMES_FROM_POSITION_FAILED = "SEARCH_GAMES_FROM_POSITION_FAILED"

export const FETCH_MOVES_FROM_WEEKLY_GAME = "FETCH_MOVES_FROM_WEEKLY_GAME"
export const FETCH_MOVES_FROM_WEEKLY_GAME_SUCCESS = "FETCH_MOVES_FROM_WEEKLY_GAME_SUCCESS"
export const FETCH_MOVES_FROM_WEEKLY_GAME_FAILED = "FETCH_MOVES_FROM_WEEKLY_GAME_FAILED"

export class FetchGame implements Action {
    type : string = FETCH_GAME
    constructor(private gameId : string) {
    }
}

export class FetchGamesOfPlayer implements Action {
    type : string = FETCH_GAMES_OF_PLAYER
    constructor(private playerId : string) {
    }
}

export class FetchGamesOfTournament implements Action {
    type : string = FETCH_GAMES_OF_TOURNAMENT
    constructor(private tournamentId : string) {
    }
}

export class FetchGamesOfMoves implements Action {
    type : string = FETCH_GAMES_OF_MOVES
    constructor(private moves : string) {
    }
}

export class FetchTopOpenings implements Action {
    type : string = FETCH_OPENINGS
    constructor(private count){}
}

export class FetchTopOpening implements Action {
    type : string = FETCH_OPENING
    constructor(private id: string){}
}

export class SearchGames implements Action {
    type:  string =SEARCH_GAMES
    constructor(private params : GameSearchParams, private page : number, private count :number){}
}

export class FetchMoves implements Action {
    type : string = FETCH_MOVES
    constructor(private fen : string){}
}

export class SearchGamesFromPosition implements Action{
    type : string = SEARCH_GAMES_FROM_POSITION
    constructor(private fen : string, private page : number, private count :number){}
}

export class SearchOpenings implements Action {
    type : string = SEARCH_OPENINGS
    constructor(private term : string){}
}

export class FetchMovesFromPositionFromWeeklyGame implements Action {
    type : string = FETCH_MOVES_FROM_WEEKLY_GAME
    constructor(private fen : string){}
}
