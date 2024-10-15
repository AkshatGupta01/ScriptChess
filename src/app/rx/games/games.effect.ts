import { Injectable } from "@angular/core";
import { ScriptChessServiceService } from "src/app/services/script-chess-service.service";
import { Actions, createEffect,  ofType } from '@ngrx/effects';
import { FETCH_GAME, FETCH_GAMES_OF_MOVES, FETCH_GAMES_OF_MOVES_FAILED, FETCH_GAMES_OF_MOVES_SUCCESS, FETCH_GAMES_OF_PLAYER, FETCH_GAMES_OF_PLAYER_FAILED, FETCH_GAMES_OF_PLAYER_SUCCESS, FETCH_GAMES_OF_TOURNAMENT, FETCH_GAMES_OF_TOURNAMENT_FAILED, FETCH_GAMES_OF_TOURNAMENT_SUCCESS, FETCH_GAME_FAILED, FETCH_GAME_SUCCESS, FETCH_MOVES, FETCH_MOVES_FAILED, FETCH_MOVES_FROM_WEEKLY_GAME, FETCH_MOVES_FROM_WEEKLY_GAME_FAILED, FETCH_MOVES_FROM_WEEKLY_GAME_SUCCESS, FETCH_MOVES_SUCCESS, FETCH_OPENING, FETCH_OPENINGS, FETCH_OPENINGS_FAILED, FETCH_OPENINGS_SUCCESS, FETCH_OPENING_FAILED, FETCH_OPENING_SUCCESS, SEARCH_GAMES, SEARCH_GAMES_FAILED, SEARCH_GAMES_FROM_POSITION, SEARCH_GAMES_FROM_POSITION_FAILED, SEARCH_GAMES_FROM_POSITION_SUCCESS, SEARCH_GAMES_SUCCESS, SEARCH_OPENINGS, SEARCH_OPENINGS_FAILED, SEARCH_OPENINGS_SUCCESS } from "./games.action";
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Game } from "src/app/models/game";
import { of } from 'rxjs';
import { MOVE_FETCH_ERROR } from "src/app/static-data/error-types";

@Injectable()
export class GamesEffect {
    constructor(private chessService: ScriptChessServiceService, private action : Actions) {}

    fetchGame = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_GAME),
                mergeMap(
                    (action) => this.chessService.getGame(action["gameId"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_GAME_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_GAME_FAILED, error: e})
                        })
                    )
                )
            )
    )

    fetchGamesOfPlayer = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_GAMES_OF_PLAYER),
                mergeMap(
                    (action) => this.chessService.getGamesOfPlayers(action["playerId"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_GAMES_OF_PLAYER_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_GAMES_OF_PLAYER_FAILED, error: e})
                        })
                    )
                )
            )
    )

    fetchGamesOfTournament = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_GAMES_OF_TOURNAMENT),
                mergeMap(
                    (action) => this.chessService.getGamesOfTournaments(action["tournamentId"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_GAMES_OF_TOURNAMENT_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_GAMES_OF_TOURNAMENT_FAILED, error: e})
                        })
                    )
                )
            )
    )

    fetchGamesOfMoves = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_GAMES_OF_MOVES),
                mergeMap(
                    (action) => this.chessService.getGamesOfMoves(action["moves"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_GAMES_OF_MOVES_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_GAMES_OF_MOVES_FAILED, error: e})
                        })
                    )
                )
            )
    )

    fetchTopOpenings = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_OPENINGS),
                mergeMap(
                    (action) => this.chessService.getTopOpenings(action["count"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            localStorage.setItem("ecos", JSON.stringify(payLoad))
                            return ({type : FETCH_OPENINGS_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_OPENINGS_FAILED, error: e})
                        })
                    )
                )
            )
    )

    searchOpenings = createEffect(
        ()=> this.action
            .pipe(
                ofType(SEARCH_OPENINGS),
                mergeMap(
                    (action) => this.chessService.searchOpening(action["term"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : SEARCH_OPENINGS_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: SEARCH_OPENINGS_FAILED, error: e})
                        })
                    )
                )
            )
    )

    fetchTopOpening = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_OPENING),
                mergeMap(
                    (action) => this.chessService.getTopOpeningById(action["id"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_OPENING_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_OPENING_FAILED, error: e})
                        })
                    )
                )
            )
    )

    searchGames = createEffect(
        ()=> this.action
            .pipe(
                ofType(SEARCH_GAMES),
                mergeMap(
                    (action) => this.chessService.searchGames(action["params"], action["page"], action["count"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : SEARCH_GAMES_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: SEARCH_GAMES_FAILED, error: e})
                        })
                    )
                )
            )
    )

    fetchMoves = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_MOVES),
                mergeMap(
                    (action) => this.chessService.getMovesOfPosition(action["fen"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_MOVES_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                e.type = MOVE_FETCH_ERROR
                                return of({type: FETCH_MOVES_FAILED, error: e})
                        })
                    )
                )
            )
    )

    fetchMovesFromWeeklyGames = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_MOVES_FROM_WEEKLY_GAME),
                mergeMap(
                    (action) => this.chessService.fetchMovesFromWeeklyGames(action["fen"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_MOVES_FROM_WEEKLY_GAME_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                e.type = MOVE_FETCH_ERROR
                                return of({type: FETCH_MOVES_FROM_WEEKLY_GAME_FAILED, error: e})
                        })
                    )
                )
            )
    )

    searchGamesFromPosition = createEffect(
        ()=> this.action
            .pipe(
                ofType(SEARCH_GAMES_FROM_POSITION),
                mergeMap(
                    (action) => this.chessService.searchGamesFromPosition(action["fen"],action["page"],action["count"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : SEARCH_GAMES_FROM_POSITION_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;                                
                                return of({type: SEARCH_GAMES_FROM_POSITION_FAILED, error: e})
                        })
                    )
                )
            )
    )

}