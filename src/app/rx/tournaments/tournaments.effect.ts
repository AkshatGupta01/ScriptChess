import { Injectable } from "@angular/core";
import { ScriptChessServiceService } from "src/app/services/script-chess-service.service";
import { Actions, createEffect,  ofType } from '@ngrx/effects';
import {  FETCH_TOURNAMENT, FETCH_TOURNAMENTS, FETCH_TOURNAMENTS_FAILED, FETCH_TOURNAMENTS_SUCCESS, FETCH_TOURNAMENT_FAILED, FETCH_TOURNAMENT_SUCCESS, SEARCH_TOURNAMENTS, SEARCH_TOURNAMENTS_FAILED, SEARCH_TOURNAMENTS_SUCCESS } from "./tournaments.action";
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable()
export class TournamentEffect {
    constructor(private chessService: ScriptChessServiceService, private action : Actions) {}

    fetchTournament = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_TOURNAMENT),
                mergeMap(
                    (action) => this.chessService.getTournament(action["tournamentId"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_TOURNAMENT_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_TOURNAMENT_FAILED, error: e})
                        })
                    )
                )
            )
    )

    searchTournament = createEffect(
        ()=> this.action
            .pipe(
                ofType(SEARCH_TOURNAMENTS),
                mergeMap(
                    (action) => this.chessService.searchTournaments(action["term"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : SEARCH_TOURNAMENTS_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: SEARCH_TOURNAMENTS_FAILED, error: e})
                        })
                    )
                )
            )
    )

    fetchTournaments = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_TOURNAMENTS),
                mergeMap(
                    (action) => this.chessService.getTournaments()
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_TOURNAMENTS_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_TOURNAMENTS_FAILED, error: e})
                        })
                    )
                )
            )
    )

}