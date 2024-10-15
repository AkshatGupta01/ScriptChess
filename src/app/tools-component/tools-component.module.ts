import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseModule } from '../common/common.module';
import { BoardWithEngineComponent } from './board-with-engine/board-with-engine.component';
import { ChessBoardEditorComponent } from './chess-board-editor/chess-board-editor.component';
import { EvalBarVisualizerComponent } from './eval-bar-visualizer/eval-bar-visualizer.component';
import { FenViewerComponent } from './fen-viewer/fen-viewer.component';
import { GameEvaluatorComponent } from './game-evaluator/game-evaluator.component';
import { GameFinderComponent } from './game-finder/game-finder.component';
import { GameLabelComponent } from './game-label/game-label.component';
import { GameLabelListBoxComponent } from './game-label-list-box/game-label-list-box.component';
import { GameListBoxComponent } from './game-list-box/game-list-box.component';
import { NoobComputerComponent } from './noob-computer/noob-computer.component';
import { OpeningExplorerComponent } from './opening-explorer/opening-explorer.component';
import { PgnViewerComponent } from './pgn-viewer/pgn-viewer.component';
import { StudyWithEngineComponent } from './study-with-engine/study-with-engine.component';
import { CandidateLinesViewerComponent } from './candidate-lines-viewer/candidate-lines-viewer.component';
import { FenDbComponent } from './fen-db/fen-db.component';
import { PositionQuizComponent } from './position-quiz/position-quiz.component';
import { EndgameComponentBoxComponent } from './endgame-component-box/endgame-component-box.component';
import { BulkAnalyzerComponent } from './bulk-analyzer/bulk-analyzer.component';
import { TrainingComponent } from './training/training.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { PuzzleAttemptViewComponent } from './puzzle-attempt-view/puzzle-attempt-view.component';
import { PositionSolverComponent } from './position-solver/position-solver.component';


@NgModule({
  declarations: [
    CandidateLinesViewerComponent,
    BoardWithEngineComponent,
    ChessBoardEditorComponent,
    EvalBarVisualizerComponent,
    FenViewerComponent,
    GameEvaluatorComponent,
    GameFinderComponent,
    GameLabelComponent,
    GameLabelListBoxComponent,
    GameListBoxComponent,
    NoobComputerComponent,
    OpeningExplorerComponent,
    PgnViewerComponent,
    StudyWithEngineComponent,
    FenDbComponent,
    PositionQuizComponent,
    EndgameComponentBoxComponent,
    BulkAnalyzerComponent,
    TrainingComponent,
    PuzzleAttemptViewComponent,
    PositionSolverComponent
  ],
  imports: [
    CommonModule,
    BaseModule,
    MatBottomSheetModule
  ],
  exports : [
    CandidateLinesViewerComponent,
    BoardWithEngineComponent,
    ChessBoardEditorComponent,
    EvalBarVisualizerComponent,
    FenViewerComponent,
    GameEvaluatorComponent,
    GameFinderComponent,
    GameLabelComponent,
    GameLabelListBoxComponent,
    GameListBoxComponent,
    NoobComputerComponent,
    OpeningExplorerComponent,
    PgnViewerComponent,
    StudyWithEngineComponent,
    FenDbComponent,
    PositionQuizComponent,
    BaseModule,
    EndgameComponentBoxComponent,
    BulkAnalyzerComponent,
    TrainingComponent,
    PositionSolverComponent
  ]
})
export class ToolsComponentModule { }
