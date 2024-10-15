import { Injectable } from "@angular/core";
import { ScriptChessServiceService } from "src/app/services/script-chess-service.service";
import { Actions, createEffect,  ofType } from '@ngrx/effects';
import {  CREATE_GAME_COLLECTIONS, CREATE_GAME_COLLECTIONS_FAILED, CREATE_GAME_COLLECTIONS_SUCCESS, 
    FETCH_GAME_COLLECTION, FETCH_GAME_COLLECTIONS, FETCH_GAME_COLLECTIONS_FAILED, FETCH_GAME_COLLECTIONS_SUCCESS, 
    FETCH_GAME_COLLECTIONS_WITH_CATEGORY, 
    FETCH_GAME_COLLECTIONS_WITH_CATEGORY_FAILED, 
    FETCH_GAME_COLLECTIONS_WITH_CATEGORY_SUCCESS, 
    FETCH_GAME_COLLECTION_FAILED, FETCH_GAME_COLLECTION_SUCCESS } from "./collections.action";
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class GameCollectionEffect {
    constructor(private chessService: ScriptChessServiceService, private action : Actions) {}

    fetchGameCollection = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_GAME_COLLECTION),
                mergeMap(
                    (action) => this.chessService.getGameCollection(action["collectionId"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_GAME_COLLECTION_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_GAME_COLLECTION_FAILED, error: e})
                        })
                    )
                )
            )
    )

    fetchGameCollections = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_GAME_COLLECTIONS),
                mergeMap(
                    (action) => this.chessService.getGameCollections(action["page"], action["count"] )
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_GAME_COLLECTIONS_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_GAME_COLLECTIONS_FAILED, error: e})
                        })
                    )
                )
            )
    )

    fetchGameCollectionsWithCategory = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_GAME_COLLECTIONS_WITH_CATEGORY),
                mergeMap(
                    (action) => this.chessService.getGameCollectionsWithCategory(action["page"], action["count"], action["category"] )
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_GAME_COLLECTIONS_WITH_CATEGORY_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_GAME_COLLECTIONS_WITH_CATEGORY_FAILED, error: e})
                        })
                    )
                )
            )
    )
}