import { Injectable } from "@angular/core";
import { ScriptChessServiceService } from "src/app/services/script-chess-service.service";
import { Actions, createEffect,  ofType } from '@ngrx/effects';
import { FETCH_BANNERS, FETCH_BANNERS_FAILED, FETCH_BANNERS_SUCCESS, FETCH_PAGE, FETCH_PAGE_FAILED, FETCH_PAGE_SUCCESS, FETCH_POST, FETCH_POSTS, FETCH_POSTS_FAILED, FETCH_POSTS_SUCCESS, FETCH_POST_FAILED, FETCH_POST_SUCCESS, FETCH_WEEKLY_CHESS, FETCH_WEEKLY_CHESSES, FETCH_WEEKLY_CHESSES_FAILED, FETCH_WEEKLY_CHESSES_SUCCESS, FETCH_WEEKLY_CHESS_FAILED, FETCH_WEEKLY_CHESS_SUCCESS } from "./blogs.action";
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable()
export class PostEffect {
    constructor(private chessService: ScriptChessServiceService, private action : Actions) {}

    fetchPost = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_POST),
                mergeMap(
                    (action) => this.chessService.getPost(action["postId"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_POST_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_POST_FAILED, error: e})
                        })
                    )
                )
            )
    )

    fetchPage = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_PAGE),
                mergeMap(
                    (action) => this.chessService.fetchPage(action["slug"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            if(payLoad && payLoad["length"]) {
                                payLoad = payLoad[0];
                            }
                            return ({type : FETCH_PAGE_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_PAGE_FAILED, error: e})
                        })
                    )
                )
            )
    )

    fetchPosts = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_POSTS),
                mergeMap(
                    (action) => this.chessService.getArticles(action["offset"] as number, action["maxCount"] as number)
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_POSTS_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_POSTS_FAILED, error: e})
                        })
                    )
                )
            )
    )

    fetchWeeklyChesses = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_WEEKLY_CHESSES),
                mergeMap(
                    (action) => this.chessService.fetchWeeklyChesses(action["offset"] as number, action["maxCount"] as number)
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_WEEKLY_CHESSES_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_WEEKLY_CHESSES_FAILED, error: e})
                        })
                    )
                )
            )
    )

    fetchWeeklyChess = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_WEEKLY_CHESS),
                mergeMap(
                    (action) => this.chessService.fetchWeeklyChess(action["slug"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            if(payLoad && payLoad["length"]) {
                                payLoad = payLoad[0];
                            }
                            return ({type : FETCH_WEEKLY_CHESS_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_WEEKLY_CHESS_FAILED, error: e})
                        })
                    )
                )
            )
    )

    fetchBanners = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_BANNERS),
                mergeMap(
                    (action) => this.chessService.getBanners()
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_BANNERS_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_BANNERS_FAILED, error: e})
                        })
                    )
                )
            )
    )

}