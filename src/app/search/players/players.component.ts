import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Player } from 'src/app/models/player';
import { PlayerAction, PlayerSelector } from 'src/app/rx/players';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { metaMap } from 'src/app/static-data/meta';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit, OnDestroy {

  isLoading : boolean = true;
  ngUnsubscribe = new Subject<void>();
  players : Player[]
  searchedName : any
  displayedColumns : string[] = ["name", "dob", "elo", "federation", "fideId","games" ]
  constructor(private store : Store, private snackbar: MatSnackBar , private meta : Meta, private titleService : Title, private analyticService : AnalyticsService) { 
    if(this.meta.getTag("description")) {
      this.meta.updateTag({'name': 'description', content: metaMap["Players"].description})
    } else {
      this.meta.addTag({'name': 'description', content: metaMap["Players"].description})
    }
    this.titleService.setTitle(metaMap["Players"].title) 
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.store.dispatch(new PlayerAction.FetchPlayers());
    this.store.select(PlayerSelector.selectIsLoading).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(loading=> {
      this.isLoading = loading;
    })

    this.store.select(PlayerSelector.selectAllPlayers).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(players=> {
      this.players = players
    })
    this.analyticService.recordPlayersVisit()
  }

  search(){
    if(this.searchedName && this.searchedName.length >= 3) {
      this.store.dispatch(new PlayerAction.SearhPlayer(this.searchedName));
      this.analyticService.recordPlayerSearched(this.searchedName)
    } 
    else
      this.snackbar.open("Please enter atleast 3 characters", "close")
  }

  recordPlayerClicked(player : Player) {
    this.analyticService.recordPlayerClicked(player.name)
  }

}
