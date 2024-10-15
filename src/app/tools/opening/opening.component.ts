import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EcoModel } from 'src/app/models/eco';
import { GameAction, GameSelector } from 'src/app/rx/games';
import * as ChessJS from 'src/app/util/chessjs/chess';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-opening',
  templateUrl: './opening.component.html',
  styleUrls: ['./opening.component.scss']
})
export class OpeningComponent implements OnInit, OnDestroy {

  ngUnsubscribe = new Subject<void>();
  eco : EcoModel
  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  playedBy: string

  constructor(private store : Store,private activatedRoute : ActivatedRoute, private analyticService : AnalyticsService) { }

  ngOnInit(): void {
    let self = this;
    this.activatedRoute.params.subscribe(params=> {
      if(params["id"]) {
        this.store.dispatch(new GameAction.FetchTopOpening(params["id"]))
        this.store.select(GameSelector.selectOpening).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(eco=> {
          this.eco = eco;
          if(eco) {
            let chess = new self.Chess(eco.fen);
            self.playedBy= chess.turn() === 'b' ?"Black":"White"
            this.analyticService.recordOpeningExplorer(eco.name)
          }
        })

      }
    })

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
