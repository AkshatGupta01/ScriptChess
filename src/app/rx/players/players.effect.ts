import { Injectable } from "@angular/core";
import { ScriptChessServiceService } from "src/app/services/script-chess-service.service";
import { Actions, createEffect,  ofType } from '@ngrx/effects';
import {  FETCH_PLAYER, FETCH_PLAYERS, FETCH_PLAYERS_FAILED, FETCH_PLAYERS_SUCCESS, FETCH_PLAYER_FAILED, FETCH_PLAYER_SUCCESS, SEARCH_PLAYERS, SEARCH_PLAYERS_FAILED, SEARCH_PLAYERS_SUCCESS } from "./players.action";
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable()
export class PlayerEffect {
    constructor(private chessService: ScriptChessServiceService, private action : Actions) {}

    fetchPlayer = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_PLAYER),
                mergeMap(
                    (action) => this.chessService.getPlayer(action["playerId"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_PLAYER_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_PLAYER_FAILED, error: e})
                        })
                    )
                )
            )
    )

    fetchPlayers = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_PLAYERS),
                mergeMap(
                    (action) => this.chessService.getPlayers()
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_PLAYERS_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_PLAYERS_FAILED, error: e})
                        })
                    )
                )
            )
    )
    searchPlayers = createEffect(
        ()=> this.action
            .pipe(
                ofType(SEARCH_PLAYERS),
                mergeMap(
                    (action) => this.chessService.searchPlayers(action["name"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : SEARCH_PLAYERS_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: SEARCH_PLAYERS_FAILED, error: e})
                        })
                    )
                )
            )
    )
}