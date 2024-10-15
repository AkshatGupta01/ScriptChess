import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Game } from 'src/app/models/game';
import { GameSearchParams } from 'src/app/models/game-search-params';
import { Player } from 'src/app/models/player';
import { GameAction, GameSelector } from 'src/app/rx/games';
import { PlayerAction, PlayerSelector } from 'src/app/rx/players';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';
import { metaMap } from 'src/app/static-data/meta';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {


  isLoading : boolean = true;
  ngUnsubscribe = new Subject<void>();
  player : Player
  games : Game[];
  displayedColumns : string[] = ["whitePlayer","blackPlayer", "year", "eco", "tournament", "result","moveCount","categories", "sacrifices","gameLink" ]
  gamesLoading: boolean;
  constructor(private store : Store, private activatedRoute : ActivatedRoute, private service : ScriptChessServiceService, private meta : Meta,
    private titleService : Title, private analyticService : AnalyticsService) { }
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=> {
      let playerId = params["playerId"];
      let playerName = params["playerName"];
      this.setTitleAndMeta(playerName)
      if(playerId && playerName) {
        this.store.dispatch(new PlayerAction.FetchPlayer(playerId));
        this.store.select(PlayerSelector.selectCurrentPlayer).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(player=> {
          if(player) {
            this.player = player;
            this.loadGames();
            
          }
        })

        this.store.select(PlayerSelector.selectIsLoading).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(loading=> {
          this.isLoading = loading;
        })
      }
    })
  }

  setTitleAndMeta(playerName : string) {
    if(this.meta.getTag("description")) {
      this.meta.updateTag({'name': 'description', content: metaMap["Player"].description.replace("{1}", playerName)})
    } else {
      this.meta.addTag({'name': 'description', content: metaMap["Player"].description.replace("{1}", playerName)})
    }
    this.titleService.setTitle(metaMap["Player"].title.replace("{1}", playerName)) 
  }

  loadGames() {
    if(this.player && (!this.games || this.games.length ==0)) {
      this.store.dispatch(new GameAction.FetchGamesOfPlayer(this.player.playerId))
      this.store.select(GameSelector.selectAllGames).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(games=>{
        if(games) {
          this.games = games;
        }
      })
      this.store.select(GameSelector.selectIsLoading).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(loading=>{
        this.gamesLoading = loading;
      })
    }
  }


  recordGameClick(game : any) {
    this.analyticService.recordGameClick(game, "Collection-viewer")
  }

}
