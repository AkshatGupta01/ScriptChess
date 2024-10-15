import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { last, takeUntil } from 'rxjs/operators';
import { Tournament } from 'src/app/models/tournament';
import { TournamentAction, TournamentSelector } from 'src/app/rx/tournaments';
import { metaMap } from 'src/app/static-data/meta';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent implements OnInit,OnDestroy {

  isLoading : boolean = false;
  ngUnsubscribe = new Subject<void>();
  tournaments : Tournament[]
  searchedName : string
  constructor(private store : Store, private meta : Meta,
    private titleService : Title, private snackBar : MatSnackBar) { 
   if(this.meta.getTag("description")) {
     this.meta.updateTag({'name': 'description', content: metaMap["Tournamennts"].description})
   } else {
     this.meta.addTag({'name': 'description', content: metaMap["Tournamennts"].description})
   }
   this.titleService.setTitle(metaMap["Tournamennts"].title)
   }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.store.dispatch(new TournamentAction.FetchTournaments());
    this.store.select(TournamentSelector.selectIsLoading).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(loading => {
      this.isLoading = loading
    })

    this.store.select(TournamentSelector.selectAllTournaments).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(tournaments => {
      if(tournaments)
        this.tournaments = tournaments
    })
  }

  searchTournament() {
    if(this.searchedName && this.searchedName.trim().length >=3) {
      this.store.dispatch(new TournamentAction.SearchTournaments(this.searchedName));
    } else {
      this.snackBar.open("Please enter atleast 3 characters for search", "close")
    }
  }

}
