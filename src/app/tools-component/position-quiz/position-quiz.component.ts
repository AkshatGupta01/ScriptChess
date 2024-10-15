import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output, SimpleChange } from '@angular/core';
import { EvalCriteria, StockfishEval } from 'src/app/models/eval';
import { PositionAnalysisStorageSchema } from 'src/app/models/storage-models';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';
import { StorageService } from 'src/app/services/storage.service';
import { findGamePhase } from 'src/app/util/game-phase-finder';
import { PositionAnalyzer } from 'src/app/util/position-analyzer';
import { StockfishPositionAnalyzer } from 'src/app/util/stockfish-position-analyzer';
import { generateRandomID } from 'src/app/util/strings';
import { environment } from 'src/environments/environment';
import * as ChessJS from 'src/app/util/chessjs/chess';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { PositionQuizCompleted } from 'src/app/rx/training/training.action';
import { TrainingReport } from 'src/app/models/training';
import { MatSnackBar } from '@angular/material/snack-bar';

const CORRECT : string = "correct.png"
const INCORRECT : string = "incorrect.png"
@Component({
  selector: 'app-position-quiz',
  templateUrl: './position-quiz.component.html',
  styleUrls: ['./position-quiz.component.scss']
})
export class PositionQuizComponent implements OnInit {

  boardId : string
  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  chess = new this.Chess();
  @Input()
  currentFen : string

  @Input()
  fetching : boolean = false;

  @Output()
  onQuizFinish = new EventEmitter<any>()

  options = [
    {
      label : "White",
      value : 1
    },
    {
      label : "Black",
      value : -1
    },
    {
      label : "Equal",
      value : 0
    }
  ]
  material : string
  imbalance : string
  pawns : string
  knights : string
  bishops : string
  rooks : string
  queens : string
  mobility : string
  threats : string
  passedPawns : string
  space : string
  total : string

  materialResult : string
  imbalanceResult : string
  pawnsResult : string
  knightsResult : string
  bishopsResult : string
  rooksResult : string
  queensResult : string
  mobilityResult : string
  threatsResult : string
  passedPawnsResult : string
  spaceResult : string
  totalResult : string
  stockfishEval : StockfishEval;
  phase : number
  showResultAllowed : boolean = false;
  analyzer : StockfishPositionAnalyzer
  positionEval: string = "1000";
  selectedOption;
  engineChecking = false;
  passed = false;
  showCorrectResult: boolean;
  storageServiceRef = null;
  turn : string
  depth : number
  trainingMode = false
  constructor(private cd : ChangeDetectorRef, private storageService : StorageService, private service : ScriptChessServiceService,
    private analytics : AnalyticsService, private activatedRoute : ActivatedRoute, private store : Store, private snackbar : MatSnackBar) {
    this.boardId = generateRandomID(5).trim();
    this.depth = environment.positionAnalysisDepth
    this.analyzer = new StockfishPositionAnalyzer(this.evalCallback, environment.positionAnalysisDepth, cd, this.evalCompletedCallback, this);
    this.storageServiceRef = storageService;
  }

  ngOnInit(): void {
    if(this.currentFen)
      this.phase = findGamePhase(this.currentFen)
  }

  ngOnChanges(change : SimpleChange) {
    if(change["currentFen"] && change["currentFen"].currentValue != change["currentFen"].previousValue) {
      //this.currentFen = "1k6/7R/2K5/8/8/8/8/8 b - - 0 1";
      this.positionEval = "1000";
      this.selectedOption = null;
      this.showCorrectResult = false;
      this.passed = false;
      this.material = null;
      this.storageService.getPositionAnlysis(this.currentFen).subscribe(val=> {
        if(!val) {
          this.analyzer.runStockFishForFen(this.currentFen);
        }
      })
      this.chess = new this.Chess(this.currentFen);
      this.turn = this.chess.turn() == "b" ? "black" : "white"
    }
    this.activatedRoute.queryParams.subscribe(p=> {
      if(p["mode"] && p["mode"]=="training") {
        this.trainingMode = true;
      }
    })
  }

  checkMaterial(val) {
    this.materialResult = this.checkSelection(this.stockfishEval.material, val.value.value)
    this.enableShowResult()
  }

  checkImbalance(val) {
    this.imbalanceResult = this.checkSelection(this.stockfishEval.imbalance, val.value.value)
    this.enableShowResult()
  }

  checkPawns(val) {
    this.pawnsResult = this.checkSelection(this.stockfishEval.pawns, val.value.value)
    this.enableShowResult()
  }

  checkKnights(val) {
    this.knightsResult = this.checkSelection(this.stockfishEval.knights, val.value.value)
    this.enableShowResult()
  }

  checkBishops(val) {
    this.bishopsResult = this.checkSelection(this.stockfishEval.bishops, val.value.value)
    this.enableShowResult()
  }

  checkRooks(val) {
    this.rooksResult = this.checkSelection(this.stockfishEval.rooks, val.value.value)
    this.enableShowResult()
  }
  checkQueens(val) {
    this.queensResult = this.checkSelection(this.stockfishEval.queens, val.value.value)
    this.enableShowResult()
  }

  checkMobility(val) {
    this.mobilityResult = this.checkSelection(this.stockfishEval.mobility, val.value.value)
    this.enableShowResult()
  }

  checkThreats(val) {
    this.threatsResult = this.checkSelection(this.stockfishEval.threats, val.value.value)
    this.enableShowResult()
  }

  checkPassedPawns(val) {
    this.passedPawnsResult = this.checkSelection(this.stockfishEval.passedPawns, val.value.value)
    this.enableShowResult()
  }
  checkSpace(val) {
    this.spaceResult = this.checkSelection(this.stockfishEval.space, val.value.value)
    this.enableShowResult()
  }

  checkTotal(val) {
    this.totalResult = this.checkSelection(this.stockfishEval.total, val.value.value)
    this.enableShowResult()
  }

  checkEval(val) {
    //this.cd.detectChanges();
    let evalProducer = this.storageService.getPositionAnlysis(this.currentFen);
    if(evalProducer) {
      evalProducer.subscribe(positionAnalysis=> {
        if(positionAnalysis) {
          this.positionEval = positionAnalysis.eval;
          let isBlackBetter = false;
          let answer = 1000;
          let evalNum = 0;
          let tempVal = this.positionEval;
          if(this.positionEval.startsWith("-")) {
            // black is better
            isBlackBetter = true;
            this.positionEval = this.positionEval.substring(1);
          }

          if(isBlackBetter) {
            if(this.positionEval.startsWith("M")) {
              answer = -1;
            } else {
              evalNum = Number.parseFloat(this.positionEval);
              if(evalNum >= 1) {
                answer = -1;
              } else {
                answer = 0
              }
            }
          } else {
            if(this.positionEval.startsWith("+M")) {
              answer = 1;
            } else {
              evalNum = Number.parseFloat(this.positionEval);
              if(evalNum >= 1) {
                answer = 1;
              } else {
                answer = 0
              }
            }
          }
          this.positionEval = tempVal;
          this.passed = (answer == val.value.value);
          this.showResult();
          this.engineChecking = false;
        } else {
          this.selectedOption = val;
          this.engineChecking = true;
        }
      })
    }
    if(this.trainingMode) {
      let compltedPosition = {
        fen : this.currentFen,
        solved : this.passed
      }
      this.store.dispatch(new PositionQuizCompleted(compltedPosition))
      let reportStr = localStorage.getItem("trainingReport");
      if(reportStr) {
        let report : TrainingReport = JSON.parse(reportStr)
        if(report.positionQuizesCompleted == environment.maxPositionQuizeToComplete) {
          this.snackbar.open("Training of " + environment.maxPositionQuizeToComplete + " position quizes completed. Exiting Training mode", "close")
          this.trainingMode = false;
        }
      }
    }
  }

  evalCallback(score : string) {
    this.positionEval = score;
  }

  evalCompletedCallback(score, self : PositionQuizComponent) {
    this.cd.markForCheck();
    let positionAnalysis : PositionAnalysisStorageSchema = {
      fen : self.currentFen,
      eval : score
    }
    self.storageServiceRef.addPositionAnlysis(positionAnalysis).subscribe(position=> {
        this.positionEval = position.eval;
    });
    // self.service.updatePuzzleEval(positionAnalysis).subscribe(body=> {

    // })
    self.positionEval = score;
    if(self.selectedOption && self.selectedOption.value.value < 2) {
      self.checkEval(self.selectedOption);
    }
  }

  showResult() {
    this.showCorrectResult = true;
    this.analytics.recordPositionQuizPlay(this.passed)
  }

  showNext() {
    this.onQuizFinish.emit();
  }

  enableShowResult() {
    this.showResultAllowed = (this.materialResult != null
                              && this.imbalance != null
                              && this.pawnsResult != null
                              && this.knightsResult != null
                              && this.bishopsResult != null
                              && this.rooksResult != null
                              && this.queensResult != null
                              && this.mobilityResult != null
                              && this.threatsResult != null
                              && this.passedPawnsResult != null
                              && this.spaceResult != null
                              && this.totalResult != null)
  }

  checkSelection(actualValue : EvalCriteria, choosenValue) {
    let actualAdv = 0;
    let adv : number = 0;
    if(this.phase == 0) {
      actualAdv = actualValue.totalMG
    } else {
      actualAdv = actualValue.totalEG
    }
    if(actualAdv < -.5) {
      adv = -1
    }
    if(actualAdv > .5) {
      adv = 1;
    }
    if(adv == choosenValue) {
      return CORRECT
    } else {
      return INCORRECT
    }
  }
}
