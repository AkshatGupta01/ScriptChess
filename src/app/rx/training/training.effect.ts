import { Injectable } from "@angular/core";
import { ScriptChessServiceService } from "src/app/services/script-chess-service.service";
import { Actions, createEffect,  ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TRAINING_SAVED, TRAINING_SAVED_FAILED, TRAINING_UPDATED } from "./training.action";

@Injectable()
export class TrainingEffect {
    constructor(private chessService: ScriptChessServiceService, private action : Actions) {}
    updateTraining = createEffect(
      ()=> this.action
          .pipe(
              ofType(TRAINING_UPDATED),
              mergeMap(
                  (action) => this.chessService.updateActiveTraining()
                  .pipe(
                      map((response)=>{
                          let payLoad = response.body
                          return ({type : TRAINING_SAVED, payload : payLoad})
                      })
                      , catchError((error)=> {
                          let e:any = {}
                              e.message = error.status+":"+ error.message;
                              return of({type: TRAINING_SAVED_FAILED, error: e})
                      })
                  )
              )
          )
  )
}
