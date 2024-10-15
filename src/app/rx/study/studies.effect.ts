import { Injectable } from "@angular/core";
import { ScriptChessServiceService } from "src/app/services/script-chess-service.service";
import { Actions, createEffect,  ofType } from '@ngrx/effects';
import { FETCH_STUDY, FETCH_STUDIES, FETCH_STUDIES_FAILED, FETCH_STUDIES_SUCCESS, FETCH_STUDY_FAILED, FETCH_STUDY_SUCCESS } from "./studies.action";
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable()
export class StudyEffect {
    constructor(private chessService: ScriptChessServiceService, private action : Actions) {}

    fetchStudy = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_STUDY),
                mergeMap(
                    (action) => this.chessService.getStudy(action["slug"])
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_STUDY_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_STUDY_FAILED, error: e})
                        })
                    )
                )
            )
    )

    fetchStudys = createEffect(
        ()=> this.action
            .pipe(
                ofType(FETCH_STUDIES),
                mergeMap(
                    (action) => this.chessService.getSturies(action["offset"] as number, action["maxCount"] as number)
                    .pipe(
                        map((response)=>{
                            let payLoad = response.body
                            return ({type : FETCH_STUDIES_SUCCESS, payload : payLoad})
                        })
                        , catchError((error)=> {
                            let e:any = {}
                                e.message = error.status+":"+ error.message;
                                return of({type: FETCH_STUDIES_FAILED, error: e})
                        })
                    )
                )
            )
    )

}