import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CollectionViewerComponent } from "./collection-viewer/collection-viewer.component";
import { CollectionsByCategoryComponent } from "./collections-by-category/collections-by-category.component";
import { PlayerComponent } from "./player/player.component";
import { PlayersComponent } from "./players/players.component";
import { SearchGamesComponentPage } from "./search-games/search-games.component";
import { TournamentViewerComponent } from "./tournament-viewer/tournament-viewer.component";
import { TournamentsComponent } from "./tournaments/tournaments.component";

const routes: Routes = [
    {
        path:'collections/:collectionId/:collectionName',
        component: CollectionViewerComponent
    },
    {
        path:'collections/:category',
        component: CollectionsByCategoryComponent
    },
    {
        path:'players',
        component: PlayersComponent
    },    
    {
        path:'players/:playerId/:playerName',
        component: PlayerComponent
    },
    {
        path:'tournaments/:tournamentId/:tournamentName/:year',
        component: TournamentViewerComponent
    },
    {
        path:'tournaments',
        component: TournamentsComponent
    },
    {
        path:'games',
        component: SearchGamesComponentPage
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SearchRoutingModule { }