import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniCollectionBoxComponent } from './mini-collection-box/mini-collection-box.component';
import { SearchGamesComponent } from './search-games/search-games.component';
import { TournamentFinderComponent } from './tournament-finder/tournament-finder.component';
import { BaseModule } from '../common/common.module';



@NgModule({
  declarations: [
    MiniCollectionBoxComponent,
    SearchGamesComponent,
    TournamentFinderComponent
  ],
  imports: [
    CommonModule,
    BaseModule
  ], 
  exports : [
    MiniCollectionBoxComponent,
    SearchGamesComponent,
    TournamentFinderComponent,
    BaseModule
  ]
})
export class SearchComponentModule { }
