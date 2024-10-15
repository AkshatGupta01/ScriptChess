import { NgModule } from "@angular/core";
import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { PositionQuizComponent } from "../tools-component/position-quiz/position-quiz.component";
import { BoardWithEnginePageComponent } from "./board-with-engine-page/board-with-engine-page.component";
import { FenLoaderComponent } from "./fen-loader/fen-loader.component";
import { GameExplorerComponent } from "./game-explorer/game-explorer.component";
import { GameViewerComponent } from "./game-viewer/game-viewer.component";
import { GamesDownloadComponent } from "./games-download/games-download.component";
import { NoobComputerPlayerComponent } from "./noob-computer-player/noob-computer-player.component";
import { OpeningComponent } from "./opening/opening.component";
import { OpeningsComponent } from "./openings/openings.component";
import { PgnPlayerComponent } from "./pgn-player/pgn-player.component";
import { PositionQuizPageComponent } from "./position-quiz-page/position-quiz-page.component";
import { PuzzleSetTestComponent } from "./puzzle-set-test/puzzle-set-test.component";
import { PuzzlesComponent } from "./puzzles/puzzles.component";
import { StudyChessComponent } from "./study-chess/study-chess.component";
import { WeeklyGamesComponent } from "./weekly-games/weekly-games.component";
import { EndgameFinderComponent } from "./endgame-finder/endgame-finder.component";
import { BulkAnalyzerPageComponent } from "./bulk-analyzer-page/bulk-analyzer-page.component";
import { TrainingComponent } from "./training/training.component";
import { PositionSolverComponent } from "./position-solver/position-solver.component";

const routes: Routes = [
    {
        path:'free-chess-explorer',
        component: GameExplorerComponent
    },
    {
        path:'free-chess-engine',
        component: BoardWithEnginePageComponent
    },
    {
        path:'fen-visualizer',
        component: FenLoaderComponent
    },
    {
        path:'games/:gameId/:gameName',
        component: GameViewerComponent
    },
    {
        path:'download-games',
        component: GamesDownloadComponent
    },
    {
        path:'play-against-chess-bots',
        component: NoobComputerPlayerComponent
    },
    {
        path:'openings',
        component: OpeningsComponent
    },
    {
        path:'openings/:eco/:slug/:id',
        component: OpeningComponent
    },
    {
        path:'pgn-player',
        component: PgnPlayerComponent
    },
    {
        path:'novelty-finder',
        component: WeeklyGamesComponent
    },
    {
        path:'chess-puzzles',
        component: PuzzlesComponent
    },
    {
      path:'study',
      component : StudyChessComponent
    },
    {
      path:'puzzle-sets',
      component : PuzzleSetTestComponent
    },
    {
        path:'position-quiz',
        component: PositionQuizPageComponent
    },
    {
        path:'endgame-trainer',
        component: EndgameFinderComponent
    },
    {
        path:'multiple-chess-games-analyzer',
        component: BulkAnalyzerPageComponent
    },
    {
      path:'training',
      component : TrainingComponent
    },
    {
      path:'solve-chess-puzzles-and-chess-positions',
      component: PositionSolverComponent

    }
]

const routerOptions: ExtraOptions = {
    useHash: false,
    anchorScrolling: 'enabled',
    // ...any other options you'd like to use
  }
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ToolsRoutingModule { }
