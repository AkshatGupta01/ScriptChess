import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Game } from 'src/app/models/game';
import { GameAction, GameSelector } from 'src/app/rx/games';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { metaMap } from 'src/app/static-data/meta';

@Component({
  selector: 'app-search-games-page',
  templateUrl: './search-games.component.html',
  styleUrls: ['./search-games.component.scss']
})
export class SearchGamesComponentPage implements OnInit, OnDestroy {

  ngUnsubscribe = new Subject<void>();
  searchedGames : Game[];
  page :number = 0;
  count :number = 100;
  reachedEnd = false;
  displayedColumns : string[] = ["whitePlayer","blackPlayer", "year", "eco", "tournament", "result","moveCount","categories", "sacrifices","gameLink" ]
  isLoading: boolean;
  currentParam = undefined;
  fenMode = false;
  choosenFen= null;
  constructor(private store: Store,private snackBar : MatSnackBar, private route: ActivatedRoute, private router:Router, private meta : Meta,
     private titleService : Title, private analyticService : AnalyticsService) {
    if(this.meta.getTag("description")) {
      this.meta.updateTag({'name': 'description', content: metaMap["Search"].description})
    } else {
      this.meta.addTag({'name': 'description', content: metaMap["Search"].description})
    }
    this.titleService.setTitle(metaMap["Search"].title)
   }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params=>{
      if(params && params["fen"]) {
        this.fenMode= true;
        this.choosenFen = params["fen"]
        if(params["page"]) {
          this.page=params["page"]
        }

        if(params["count"]) {
          this.count=params["count"]
        }
        this.searchFen();
      }

    })
  }

  searchFen() {
    this.store.dispatch(new GameAction.SearchGamesFromPosition(this.choosenFen,this.page, this.count))
    this.subscribeGames();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSearch(params) {
    if(params) {
      this.currentParam=params;
    }else {
      params =this.currentParam;
    }
    if(!params){
      return;
    }

    if(params["eco"]) {
      let ecosStr = localStorage.getItem("ecos")
      if(ecosStr && ecosStr.trim().length > 0) {
        let ecos = JSON.parse(ecosStr)
        for(let i = 0; i<ecos.length;i++) {
          if(ecos[i].eco == params["eco"]) {
            let title = "Results: Games of " + ecos[i].ecoModel.name;
            this.titleService.setTitle(title)
          }
        }
      } else {
        let title = "Results: Games of Eco " + params["eco"];
        this.titleService.setTitle(title)
      }
    }

    this.store.dispatch(new GameAction.SearchGames(params, this.page,this.count));
    this.subscribeGames();
    this.analyticService.recordSearch(JSON.stringify(params))
  }

  subscribeGames() {
    this.store.select(GameSelector.selectAllGames).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(games=> {
      if(!games)
        return
      if(games && games.length == 0) {
        this.reachedEnd = true;
      }
      this.searchedGames = games;
    })

    this.store.select(GameSelector.selectIsLoading).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(loading=>{
      this.isLoading = loading;
    })

    this.store.select(GameSelector.selectError).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(error=>{
      if(error)
        this.snackBar.open(error);
    })
  }

  onNext() {
    if(this.page <1000) {
      this.page++;
      if(!this.fenMode)
        this.onSearch(undefined);
      else {
        this.searchFen();
        this.router.navigateByUrl("/search/games?fen="+this.choosenFen+"&page="+this.page+"&count="+this.count)
      }
    }
  }

  onPrev() {
    if(this.page > 0) {
      this.page--;
      if(!this.fenMode)
        this.onSearch(undefined);
      else {
        this.searchFen();
        this.router.navigateByUrl("/search/games?fen="+this.choosenFen+"&page="+this.page+"&count="+this.count)
      }
    }

  }

  recordGameClick(game : any) {
    this.analyticService.recordGameClick(game, "Collection-viewer")
  }

}
