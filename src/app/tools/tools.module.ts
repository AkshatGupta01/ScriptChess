import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsComponentModule } from '../tools-component/tools-component.module';
import { BoardWithEnginePageComponent } from './board-with-engine-page/board-with-engine-page.component';
import { FenLoaderComponent } from './fen-loader/fen-loader.component';
import { GameExplorerComponent } from './game-explorer/game-explorer.component';
import { GameViewerComponent } from './game-viewer/game-viewer.component';
import { GamesDownloadComponent } from './games-download/games-download.component';
import { OpeningComponent } from './opening/opening.component';
import { OpeningsComponent } from './openings/openings.component';
import { PgnPlayerComponent } from './pgn-player/pgn-player.component';
import { WeeklyGamesComponent } from './weekly-games/weekly-games.component';
import { PuzzlesComponent } from './puzzles/puzzles.component';
import { NoobComputerPlayerComponent } from './noob-computer-player/noob-computer-player.component';
import { ToolsRoutingModule } from './tools.router';
import { StudyChessComponent } from './study-chess/study-chess.component';
import { PuzzleSetTestComponent } from './puzzle-set-test/puzzle-set-test.component';
import { PositionQuizPageComponent } from './position-quiz-page/position-quiz-page.component';
import { EndgameFinderComponent } from './endgame-finder/endgame-finder.component';
import { BulkAnalyzerPageComponent } from './bulk-analyzer-page/bulk-analyzer-page.component';
import { TrainingComponent } from './training/training.component';
import { PositionSolverComponent } from './position-solver/position-solver.component';



@NgModule({
  declarations: [
    BoardWithEnginePageComponent,
    FenLoaderComponent,
    GameExplorerComponent,
    GameViewerComponent,
    GamesDownloadComponent,
    OpeningComponent,
    OpeningsComponent,
    PgnPlayerComponent,
    WeeklyGamesComponent,
    PuzzlesComponent,
    NoobComputerPlayerComponent,
    StudyChessComponent,
    PuzzleSetTestComponent,
    PositionQuizPageComponent,
    EndgameFinderComponent,
    BulkAnalyzerPageComponent,
    TrainingComponent,
    PositionSolverComponent
  ],
  imports: [
    CommonModule,
    ToolsRoutingModule,
    ToolsComponentModule

  ]
})
export class ToolsModule {

 }
