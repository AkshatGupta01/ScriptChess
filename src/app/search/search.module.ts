import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseModule } from '../common/common.module';
import { CollectionViewerComponent } from './collection-viewer/collection-viewer.component';
import { CollectionsByCategoryComponent } from './collections-by-category/collections-by-category.component';
import { TournamentViewerComponent } from './tournament-viewer/tournament-viewer.component';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { PlayerComponent } from './player/player.component';
import { PlayersComponent } from './players/players.component';
import { SearchRoutingModule } from './search.router';
import { SearchGamesComponentPage } from './search-games/search-games.component';
import { SearchComponentModule } from '../search-component/search-component.module';



@NgModule({
  declarations: [
    CollectionViewerComponent,
    CollectionsByCategoryComponent,
    SearchGamesComponentPage,
    TournamentViewerComponent,
    TournamentsComponent,
    PlayerComponent,
    PlayersComponent
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    SearchComponentModule,
    BaseModule
  ]
})
export class SearchModule { }
