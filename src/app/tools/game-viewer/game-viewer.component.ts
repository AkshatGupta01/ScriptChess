import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Game } from 'src/app/models/game';
import { GameAction, GameSelector } from 'src/app/rx/games';
import { metaMap } from 'src/app/static-data/meta';

@Component({
  selector: 'app-game-viewer',
  templateUrl: './game-viewer.component.html',
  styleUrls: ['./game-viewer.component.scss']
})
export class GameViewerComponent implements OnInit, OnDestroy {

  game : Game | undefined 
  isLoading : boolean = true;
  ngUnsubscribe = new Subject<void>();
  name : string

  title : string

  constructor(private store : Store, private route : ActivatedRoute, private meta : Meta, private titleService : Title) { }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    
    this.route.params.subscribe(param=>{
      let gameId = param["gameId"]
      this.name = param["gameName"]
      this.store.dispatch(new GameAction.FetchGame(gameId));
    })

    this.store.select(GameSelector.selectIsLoading).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(loading=> {
      this.isLoading = loading
    })

    this.store.select(GameSelector.selectCurrentGame).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(game=> {
      this.game = game
      if(game) {
        this.title = game.whitePlayer.name + " vs " + game.blackPlayer.name +" (" + game.result +")"
        let date = new Date(game.date)
        this.setTitleAndMeta(game.whitePlayer.name, game.blackPlayer.name, game.event, date.getFullYear()+"", game.tags)
      }
      
    })
  }

  ngAfterViewInit() {
    this.scrollToTitle();
  }

  scrollToTitle() {
    setTimeout(() => {
      document.getElementById("chess-board-container").scrollIntoView();  
    }, 3000);
    
  }

  setTitleAndMeta(white : string,black : string,tournament : string,year : string, categories : string[]) {
    this.meta.updateTag({'name': 'description', content: metaMap["Game"].description
      .replace("{1}", white)
      .replace("{2}", black)
      .replace("{3}", tournament)
      .replace("{4}", year)})
    this.titleService.setTitle(metaMap["Game"].title.replace("{1}", white)
    .replace("{2}", black)
    .replace("{3}", tournament)
    .replace("{4}", year)) 
    let tags = "";
    if(categories && categories.length > 0) {      
      categories.forEach(tag=> {
        tags = tags + "," + tag.replace(/_/g," ").toLowerCase();
      })
      tags = tags.substring(1, tags.length);      
    }
    tags = white +" vs " + black + " in " + tournament+"," + tags
    if(tags.trim().length > 0) {
      this.meta.updateTag({name:"keyword",content: tags})
    }

  }

}
