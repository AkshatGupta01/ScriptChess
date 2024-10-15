import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ECO, EcoModel } from 'src/app/models/eco';
import { Player } from 'src/app/models/player';
import { GameAction, GameSelector } from 'src/app/rx/games';
import { PlayerAction, PlayerSelector } from 'src/app/rx/players';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { gameTypes as  gameCats, sacTypes} from 'src/app/static-data/game-types';

@Component({
  selector: 'app-search-games',
  templateUrl: './search-games.component.html',
  styleUrls: ['./search-games.component.scss']
})
export class SearchGamesComponent implements OnInit,OnDestroy {

  whitePlayerName:string
  blackPlayerName:string
  category : string=""
  sacrifice : string = ""
  whitePlayers: string[] = []
  blackPlayers: string[] = []
  obsWhitePlayers: Observable<string[]>
  obsBlackPlayers: Observable<string[]>
  year : number
  tournament : string
  gameTypes : any[] = gameCats
  sacrificeTypes : any[] = sacTypes
  ngUnsubscribe = new Subject<void>();
  obsEcos : Observable<string[]>
  ecos : ECO[]
  selectedEco: string;
  selecetdFen  :string
  @Output()
  onSearch = new EventEmitter<any>()

  constructor(private store:Store, private activatedRoute : ActivatedRoute, private router : Router, private analyticService : AnalyticsService) { }

  ngOnInit(): void {
    this.obsBlackPlayers = of([])
    this.obsWhitePlayers = of([])
    this.store.dispatch(new GameAction.FetchTopOpenings(1000));
    this.store.select(GameSelector.selectTopOpenings).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(openings=> {
      if(openings) {
        this.ecos = openings;
        this.activatedRoute.queryParams.subscribe(params=> {
          if(params["eco"]) {
            let eco = params["eco"];
            let tmpEco = []
            this.ecos.forEach(e=> {
              if(e.eco == eco) {
                this.searchEcos = eco;
                tmpEco.push(e.ecoModel.name + "(" +eco +")");                
              }
            })
            this.obsEcos = of(tmpEco);            
          }
        })
      }
    })


    
  }


  ngAfterViewInit() {
    this.activatedRoute.queryParams.subscribe(params=> {
      if(params["eco"]) {
        let eco = params["eco"];   
        let param = {
          eco : eco
        }
        this.onSearch.emit(param)       
      }
    })
    
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  selectedGameType(tyep : any) {

  }

  selectedSacrificeType(tyep : any) {
    
  }

  searchWhitePlayer(target : any) {
    let name = target.value;
    if(name && name.length > 3) {
      this.store.dispatch(new PlayerAction.SearhPlayer(name));
      this.store.select(PlayerSelector.selectAllPlayers).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(players=> {
        this.whitePlayers = []
        players.forEach(p=>{
          this.whitePlayers.push(p.name)
        })
        this.obsWhitePlayers = of(this.whitePlayers)

      });
    }
    
  }

  searchBlackPlayer(target : any) {
    let name = target.value;
    if(name && name.length > 3) {
      this.store.dispatch(new PlayerAction.SearhPlayer(name));
      this.store.select(PlayerSelector.selectAllPlayers).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(players=> {
        this.blackPlayers = []
        players.forEach(p=>{
          this.blackPlayers.push(p.name)
        })
        this.obsBlackPlayers = of(this.blackPlayers)

      });
    }    
  }

  search(categoryControl, sacrificeControl) {
    if(this.selectedEco) {
      if(this.selectedEco.indexOf("(") > 0) {
        this.selectedEco = this.selectedEco.split("(")[1].split(")")[0];
      }
    }
    let param = {
      whitePlayer : this.whitePlayerName,
      blackPlayer : this.blackPlayerName,
      year:this.year,
      tournament: this.tournament,
      category: categoryControl.value,
      sacrifice:sacrificeControl.value,
      eco : this.selectedEco
    }
    this.analyticService.recordGameSearchClick(param)
    this.onSearch.emit(param)
  }

  searchEcos(event:any, target : any) {
    let name : string = target.value + event.key;
    name = name.toLowerCase();
    let tmpEcos : string[] = []
    if(name && name.length > 2) {
      this.ecos.forEach(e=>{
        if(e.ecoModel.name.toLowerCase().indexOf(name) > -1) {
          tmpEcos.push(e.ecoModel.name + "(" + e.eco + ")")
        }
      })
      this.obsEcos = of(tmpEcos);
    }
    
  }

  onFenEnter(fen) {
    this.analyticService.recordFenSearchClick(fen)
    this.router.navigate(["/search/games"],{queryParams:{fen:fen,page:0,count:100}})
  }

  
}
