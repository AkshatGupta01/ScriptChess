import { Component, HostListener, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { generateRandomID } from 'src/app/util/strings';
import * as ChessJS from 'src/app/util/chessjs/chess';
import { environment } from 'src/environments/environment';
import { Move, MoveCategory, PrimaryLine, PrimaryLines } from 'src/app/models/move';
import { MoveCollection } from 'src/app/models/move-collection';
import { ChessColors } from 'src/app/models/board.config';
import {MatMenuTrigger} from '@angular/material/menu'
import { MatDialog } from '@angular/material/dialog';
import { AddCommentDialogue } from './add-comment-dialoge';
import { ShowCommentDialogue } from './show-comment-dialoge';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';
import { exportPgn } from 'src/app/util/pgn-exporter';
import { ShowResultDialogue } from './show-result-dialoge';
import { ExportPgnDialoge } from './export-pgn-dialoge';
import { FormControl } from '@angular/forms';
import { StockfishEval } from 'src/app/models/eval';
import { StockfishGameAnalyzer } from 'src/app/util/stockfish-game-analyzer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { findGamePhase } from 'src/app/util/game-phase-finder';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { StorageService } from 'src/app/services/storage.service';
import { AnalysisStorageSchema } from 'src/app/models/storage-models';
import { DatePipe } from 'src/app/pipes/date.pipe';
import { md5 } from 'src/app/util/md5';
import { Game } from 'src/app/models/game';
import { AnalysisNameDialog } from './analysis-name-dialog';
import { FeedbackService } from 'src/app/services/feedback.service';
import { getStockfishPath } from 'src/app/util/stockfish-util';
import { ChessBoardComponent } from 'src/app/common/chess-board/chess-board.component';
import { RatingFormComponent } from 'src/app/common/rating-form/rating-form.component';
import { Store } from '@ngrx/store';
import { getHalfMoveNumberFromFen } from 'src/app/util/fen-validator';
import {MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { GameReviewed } from 'src/app/rx/training/training.action';

declare function drawArrowBetweenSquare(s1,s2,id) : any
declare function removeAllSquareConnectingArrow(id) : any
declare function addClassification(square, classification): any
declare function removeClassiciation() : any;
declare function stopScrollForce() : any
declare function resumedScrollForce() : any
export interface MoveCommentDialogeData {
  move : Move
  comment : string
}

export interface AnalysisNameDialogeData {
  name : string
}

export interface CommentDialogeData {
  move : Move
}

export interface GameResultDialogeData {
  result : string
  pgn : string
}

export interface PgnDialogeData {
  pgn : string
}


@Component({
  selector: 'app-board-with-engine',
  templateUrl: './board-with-engine.component.html',
  styleUrls: ['./board-with-engine.component.scss']
})
export class BoardWithEngineComponent implements OnInit {

  @Input()
  allowSetPosition : boolean = false;

  engineDepth = 25
  score = "0";
  boardId : string
  sparePieceBoardId  :string
  currentFen : string
  setupFen : string = null;
  positionScoreMap = {}
  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  chess = new this.Chess();
  chessForEngine : any;
  playedMoves = []
  engineWorker : any;
  evalWorker : any;
  engineRegistered: boolean;
  //move cat
  BLUNDER = 2;
  DUBIOUS = 0.5;
  MISTAKE = 1.99;

  BEST = 0.3;
  BRILLIANT = 0.5;
  GOOD_MOVE = 0.2;
  moveIndex = 0;
  engineThinking = false;
  selectedMove : Move
  isSideMoveOn = false
  moveCollection : MoveCollection
  initialPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

  openingName : string
  bookMoveEnds = false
  gameResult = null;
  //for context menu
  menuTopLeftPosition =  {x: '0', y: '0'}
  lastPlayedMove : Move
  gameStarted : boolean;
  candidateLines : PrimaryLines;
  positionEval : string = ""
  selectedTab = new FormControl(0);
  stockFishEval : StockfishEval;
  gameAnalysisMode : boolean
  gameAnalysisOn : boolean
  parsingPgn : boolean = false;
  gameAnalysisProgess : number;
  // reference to the MatMenuTrigger in the DOM
  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger;
  evalEngineRegistered: boolean;
  showBestMove = false;
  showFullAnalysis : boolean = false;
  phase : number
  positionAnalysisMode: boolean;
  analysisSentOn : number = 0;
  analysisSentInterval : number = 10;
  gamePgnStr : string
  engineStartedAt : number
  evalEngineStartedAt : number
  showStoargeWarning : boolean = false;
  showSavedAnalysis : boolean = false;
  savedAnalysis : AnalysisStorageSchema[]
  reRunNewPosition = false;
  quitSent = false;
  showFen : boolean = false;
  currentGame : Game = null;
  currentPgn = null;
  showEngineLines = false;
  analysisCompleted = false;
  private readonly GAME_ANALYSIS_DEPTH = environment.gameAnalysisDepth;
  countDownTimer = 0;
  feedbackNotAsked = true;
  FEEDBACK_WAIT_TIME_IN_SECONDS: number = 60;
  autoPlay : boolean = false;
  onlyAttacks : boolean = false;
  @ViewChild('board')
  board : ChessBoardComponent;
  MIN_OPENING_HALF_MOVE_COUNT = 12;
  scrollLocked = false;
  analysisBeginsOnMoveNumber = 0;
  gameNotes = "";
  trainingMode: boolean = false;
  annotatedMovesCount = 0;
  trainingGameId = null;
  eligibleForReviewCompletion = false;
  MIN_ANNOTATION_REQUIRED = 5;

  whiteOrientated = true;
  constructor(public dialog: MatDialog, private service : ScriptChessServiceService,
    private snackbar : MatSnackBar, private router : Router, private analyticService : AnalyticsService,
    private storageService : StorageService, private activatedRoute : ActivatedRoute,
    private feedbackService : FeedbackService, private renderer2 : Renderer2, private store : Store,
    private bottomSheet: MatBottomSheet
    ) {
    this.boardId = generateRandomID(5).trim();
    this.sparePieceBoardId = generateRandomID(5).trim();

  }

  ngOnInit(): void {
    this.registerStockFish();
    this.registerEvalStockFish();
    this.moveCollection = new MoveCollection();
  }

  onMove(moveDetails) {
    if(this.feedbackNotAsked) {
      this.loadFeedbackForm();
    }
    this.gameStarted = true;
    removeAllSquareConnectingArrow(this.boardId)
    let fen = this.chess.fen();
    let scoreMap = this.positionScoreMap[fen];
    let moveNumber = 0;
    this.moveIndex++
    moveNumber = this.moveIndex == 0 ? 1 : this.moveIndex %2 > 0 ? Math.ceil((this.moveIndex +1)/2) : Math.floor(this.moveIndex/2)
    //moveNumber = moveNumber == 0 ? 1 : moveNumber;
    let playedBy = this.chess.turn() == 'w' ? ChessColors.white : ChessColors.black // since the move is not made on chess object
    let playedMove : Move = {
      move : moveDetails.move.san,
      moveNumber : moveNumber,
      playedBy
    }

    if(scoreMap && scoreMap["bestMove"] && scoreMap["bestMove"] == moveDetails.move.san) {
      playedMove.moveCat = MoveCategory.BEST.toString()
    } else {
      if(scoreMap && scoreMap["bestMove"] && this.moveIndex > this.MIN_OPENING_HALF_MOVE_COUNT) {
        //this.chess.undo();
        let bestMove = this.chess.move(scoreMap["bestMove"])
        this.chess.undo();
        //this.chess.move(moveDetails.move.san)
        if(this.showBestMove)
          drawArrowBetweenSquare(bestMove.from, bestMove.to, this.boardId)
      }
    }

    this.chess.move(moveDetails.move.san)
    this.currentFen = this.chess.fen();
    this.moveCollection.addMove(playedMove);
    this.playedMoves = this.moveCollection.getMoveArray();

    this.lastPlayedMove = this.moveCollection.getLastPlayedMove();
    if(this.lastPlayedMove.moveCat) {
      this.annotateWithClassification(this.lastPlayedMove)
    }
    this.selectedMove = null;
    this.checkGameCompletion();
    //this.selectedTab.setValue(0)
    if(this.gameResult !=  null) {
      this.showResultDialoge();
    } else {
      this.positionEval = "";
      this.runStockFishForFen(this.currentFen);
      //this.runStockFishEvalForFen(this.currentFen);
      this.fetchBookMove(this.lastPlayedMove);
    }
    this.phase = findGamePhase(this.currentFen)
    if(!this.positionAnalysisMode && !this.gameAnalysisMode) {
      if(this.moveIndex == 0) {
        this.analyticService.recordFreshAnalysis(this.openingName, 0)
      }
    } else {
      if(!this.gameAnalysisMode) {
        if(Math.abs(this.moveIndex - this.analysisSentOn) >= this.analysisSentInterval ) {
          if(this.positionAnalysisMode) {
            this.analyticService.recordPositionAnalysis(this.moveIndex)
          } else {
            this.analyticService.recordFreshAnalysis(this.openingName, this.moveIndex)
          }

        }
      }
    }

  }

  showResultDialoge() {
    this.chess.header("Event", "Game analysis on Scriptchess.com", "Site", "https://scriptchess.com", "White","?","Black","?","Result","*")
    let pgn = this.chess.pgn({ maxWidth: 35, newline: '\n' })
    const dialogRef = this.dialog.open(ShowResultDialogue, {
      data: {
        result : this.gameResult,
        pgn
      },
    });
  }

  showExportDialoge() {
    let result = this.gameResult ? this.gameResult : "*"
    let pgn = exportPgn(this.playedMoves, result, this.initialPosition)
    const dialogRef = this.dialog.open(ExportPgnDialoge, {
      data: {
        pgn
      },
    });
  }

  checkGameCompletion() {
    let gameOver = this.chess.isGameOver()
    if(gameOver) {
      let winCondition = this.chess.isCheckmate();
      let turn = this.chess.turn();
      if(winCondition) {
        if(turn == 'w') {
          this.gameResult = "0-1"
        } else {
          this.gameResult = "1-0"
        }
      } else {
        this.gameResult = "1/2-1/2";
      }
    }
  }

  runStockFishForFen(fen : string) {
    if(this.engineThinking) {
      if(!this.quitSent) {
        this.engineWorker.postMessage('stop')
        this.registerStockFish();
        this.reRunNewPosition = true;
      }
    } else {
        this.runStockfishForCurrentFen()
    }
  }

  runStockfishForCurrentFen() {
    this.candidateLines = null;
    this.engineWorker.postMessage('position fen ' + this.currentFen);
    this.engineWorker.postMessage(`go depth ` + this.engineDepth)
    this.engineThinking = true;
    this.quitSent = false;
  }

  runStockFishEvalForFen(fen : string) {
    this.evalWorker.postMessage('position fen ' + fen);
    this.evalWorker.postMessage(`eval`)
    this.engineThinking = true;
  }

  registerEvalStockFish() {
    if (typeof Worker !== 'undefined') {
      this.evalWorker = new Worker(new URL(getStockfishPath()));
      this.evalWorker.onmessage = ({ data }) => {
        if(data === "uciok") {
          this.evalEngineRegistered = true;
        } else {
          var line : string = "";

          if (data && typeof data === "object") {
              line = data.data;
          } else {
              line = data;
          }


          /// Ignore some output.
          if (line === "uciok" || line === "readyok" || line.substr(0, 11) === "option name") {
              return;
          }
          if(this.positionEval) {
            this.positionEval += "\n";
          }
          this.positionEval += line;
          if(line.indexOf("Total") > 0 && line.indexOf("Term") < 0) {
            this.stockFishEval = new StockfishEval(this.positionEval);
            this.phase = findGamePhase(this.currentFen)
          }
      }
      }
    }
  }

  registerStockFish() {
    if (typeof Worker !== 'undefined') {
      if(!this.engineWorker) {
        this.engineWorker = new Worker(new URL(getStockfishPath()));
        this.engineWorker.onmessage = ({ data }) => {
          if(data === "uciok") {
            if(!this.reRunNewPosition) {
              this.engineRegistered = true;
              this.runStockFishForFen(this.chess.fen());
              this.checkForSavedGameAnalysis();
            } else {
              this.runStockfishForCurrentFen()
            }

          } else {
            if(this.gameAnalysisOn) {
              return
            }
            //check for best move
            if(data && (data+"").startsWith("bestmove")) {

              let match = data.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
              this.chessForEngine = new this.Chess(this.currentFen);
              let move = this.chessForEngine.move({from: match[1], to: match[2], promotion: match[3]});
              if(move) {
                let obj = {};
                if(!this.positionScoreMap[this.currentFen]) {
                  obj = {
                    bestMove : move.san
                  }
                } else {
                  obj = {
                    ...this.positionScoreMap[this.currentFen],
                    bestMove : move.san
                  }
                }
                this.positionScoreMap[this.currentFen] = obj;
                if(this.showBestMove) {
                  drawArrowBetweenSquare(move.from, move.to, this.boardId)
                }
              }
              this.engineThinking = false;
            } else {
              //calculate score]

              let match = data.match(/^info depth (\d+) .*\bscore (\w+) (-?\d+).*\bpv (.*)/)
              if(match)  {
                var tmpScore = parseInt(match[3]) * (this.chess.turn() == 'w' ? 1 : -1);
                if(match[2] == 'cp') {
                  tmpScore = (tmpScore / 100.0)
                  let diff = tmpScore - Number.parseFloat(this.score);
                  let badMove = false;
                  this.score = tmpScore.toFixed(2);
                  if(match[1] == this.engineDepth+"") {

                    if(this.playedMoves.length == 0 || this.playedMoves[this.playedMoves.length -1].moveCat) {
                      return;
                    }
                    let scoreMap = {
                      eval : this.score
                    }
                    this.positionScoreMap[this.currentFen] = scoreMap
                    let turn = this.chess.turn();
                    //if white to play and diff is positive then it was a badmove by black
                    //if black to play and diff is negative then it was a badMove by white
                    if((turn == 'w' && diff > 0) || (turn == 'b' && diff < 0)) {
                      badMove = true;
                    }
                    diff = Math.abs(diff)
                    let moveCat = "";
                    if(badMove) {
                      if(diff >= this.BLUNDER) {
                        if(turn == 'w' && tmpScore > 3) {
                          moveCat = MoveCategory.MISTAKE.toString()
                        } else {
                          if(turn == 'b' && tmpScore > -3) {
                            moveCat = MoveCategory.MISTAKE.toString()
                          } else {
                            moveCat = MoveCategory.BLUNDER.toString()
                          }
                        }

                      } else {
                        if(diff >= this.MISTAKE) {
                          moveCat = MoveCategory.MISTAKE.toString()
                        } else {
                          if(diff >= this.DUBIOUS) {
                            moveCat = MoveCategory.DUBIOUS.toString()
                          } else {
                            if(diff < this.DUBIOUS) {
                              moveCat = MoveCategory.GOOD_MOVE.toString()
                            }
                          }
                        }
                      }
                    } else {
                      if(diff > this.BRILLIANT) {
                        moveCat = MoveCategory.BRILLIANT.toString()
                      } else {
                        moveCat = MoveCategory.BEST.toString()
                      }
                    }
                    let lastMove = this.playedMoves[this.playedMoves.length -1];
                    if(!lastMove.moveCat || lastMove.moveCat != MoveCategory.BOOK_MOVE.toString())
                      this.playedMoves[this.playedMoves.length -1].moveCat = moveCat
                  }
                } else if(match[2] == 'mate') {
                  //let intScore = Number.parseInt(this.score)
                  let lastMove = this.playedMoves[this.playedMoves.length -1];
                  if(tmpScore > 0)
                    this.score = '+M' + tmpScore;
                  else
                    this.score = '-M' + Math.abs(tmpScore);

                  if(lastMove && !lastMove.moveCat) {
                    lastMove.moveCat = MoveCategory.GOOD_MOVE.toString()
                  }
                }

                let pv : string = match[4];
                if(pv && pv.trim().length > 0) {
                  if(this.engineDepth < 5)
                    this.candidateLines = new PrimaryLines();
                  else {
                    if(!this.candidateLines) {
                      this.candidateLines = new PrimaryLines();
                    }
                  }
                  this.candidateLines.setDepth(match[1])
                  let lans = pv.split(" ");

                  let lanToSanChess = new this.Chess(this.currentFen);
                  let pvMoves = []
                  lans.forEach(lan=> {
                    let moveMatch = lan.match(/^([a-h][1-8])([a-h][1-8])([qrbn])?/)
                    if(moveMatch) {
                      let sanMove = lanToSanChess.move({from: moveMatch[1], to: moveMatch[2], promotion: moveMatch[3]});
                      if(sanMove)
                        pvMoves.push(sanMove.san)
                    }
                  })
                  if(pvMoves.length > 0) {

                    if(match[2] == 'cp') {
                      let pvEval = tmpScore.toFixed(2)
                      this.candidateLines.pushLine(new PrimaryLine(pvEval, pvMoves, match[1]));
                    } else if(match[2] == 'mate') {
                      if(tmpScore > 0)
                        this.candidateLines.pushLine(new PrimaryLine('+M' + tmpScore, pvMoves, match[1]));
                      else
                        this.candidateLines.pushLine(new PrimaryLine('-M' + Math.abs(tmpScore), pvMoves, match[1]));
                    }
                  }
                }
              }
            }

          }
        }
      }

      this.engineWorker.postMessage("uci")
      setTimeout(()=> {
        if(!this.engineRegistered) {
          let snackbarRef = this.snackbar.open("Failed to register engine", "Reload")
          snackbarRef.afterDismissed().subscribe(info=> {
            if(info.dismissedByAction) {
              window.location.reload();
            }
          })
        }
      }, 2000)
    }
  }
  checkForSavedGameAnalysis() {
    this.activatedRoute.queryParams.subscribe(params=> {
      if(params && params["gameId"]) {
        this.storageService.getGame(Number.parseInt(params["gameId"])).subscribe(game=> {
          this.onPgnEnter(game.pgn)
          this.openingName = game.eco
        })
      } else {
        if(params && params["fen"]) {
          let fen = atob(params["fen"])
          this.currentFen = fen;
          setTimeout(()=>this.onFenEnter(fen), 200)

        } else {
          if(params && params["analysisId"]) {
            this.storageService.getAnalysis(params["analysisId"]).subscribe(analysis=> {
              this.loadAnalysis(analysis)
            })
          } else {
            if(params && params["fetchgameId"]) {
              this.service.getGame(params["fetchgameId"]).subscribe(res=> {
                if(res && res.body) {
                  let game = res.body;
                  this.onPgnEnter(game.pgn)
                }
              })
              if(params && params["mode"] == "training") {
                this.trainingMode = true
              }

              this.trainingGameId = params["fetchgameId"];
              if(params["playAs"]) {
                this.whiteOrientated = params["playAs"] == "white" ? true : false;
              }

            }
          }
        }
      }
    })
  }

  setPosition(move : Move, byBlack : boolean)  {
    if(this.gameAnalysisOn) {
      this.snackbar.open("Let the analysis complete", "close");
      return;
    }
    this.chess = new this.Chess(this.initialPosition)
    this.board.setInitialPosition(this.initialPosition)
    let playedMove = null;
    let alreadyPlayedMoves = [];

    for(let index = 0; index < this.playedMoves.length; index++) {
      if(this.playedMoves[index].move == move.move &&
        this.playedMoves[index].moveNumber == move.moveNumber &&
        this.playedMoves[index].playedBy == move.playedBy) {
        playedMove = this.chess.move(this.playedMoves[index].move)
        alreadyPlayedMoves.push(playedMove.san);
        this.fetchBookMove(move);
        this.selectedMove = this.playedMoves[index]
        this.moveCollection.setLastPlayedMove(this.selectedMove)
        this.isSideMoveOn = this.playedMoves[index].isSideMove
        this.moveIndex = this.analysisBeginsOnMoveNumber + index + 1;
        break
      } else {
        playedMove = this.chess.move(this.playedMoves[index].move)
        alreadyPlayedMoves.push(playedMove.san);
      }

    }
    this.currentFen = this.chess.fen();
    if(this.board) {
      this.board.makeMoves(alreadyPlayedMoves);
    }
    this.runStockFishForFen(this.currentFen)
    this.runStockFishEvalForFen(this.currentFen)
    this.phase = findGamePhase(this.currentFen)
    this.annotateWithClassification(move)
    this.lastPlayedMove = this.moveCollection.getLastPlayedMove();
  }

  annotateWithClassification(move : Move) {
    if(move.moveCat) {
      let classification = "";
      switch(move.moveCat) {
        case MoveCategory.BRILLIANT.toString():
        case "brilliant":
          classification = "brilliant.png"
          break;
        case MoveCategory.BEST.toString() :
          classification = "best.png"
          break;
        case MoveCategory.GOOD_MOVE.toString() :
          classification = "good.png"
          break;
        case MoveCategory.DUBIOUS.toString() :
          classification = "dubious.png"
          break;
        case MoveCategory.MISTAKE.toString() :
          classification = "mistake.png"
          break;
        case MoveCategory.BLUNDER.toString() :
          classification = "blunder.png"
          break;
        case MoveCategory.BOOK_MOVE.toString() :
          classification = "book.png"
          break;
      }
      let square = move.move.substring(move.move.length -2);
      addClassification(square, classification);
    } else {
      removeClassiciation()
    }
  }

  onMoveClick(move : Move) {
    let moves = this.moveCollection.createMoveSequence(move);
    this.chess = new this.Chess(this.initialPosition);
    moves.forEach(move=> {
      this.chess.move(move.move);
    })
    this.currentFen = this.chess.fen();
    this.moveCollection.setLastPlayedMove(move);
    this.lastPlayedMove = move;
    this.phase = findGamePhase(this.currentFen)
    this.runStockFishForFen(this.currentFen)
    this.moveIndex = move.moveNumber * 2;
    if(move.playedBy == ChessColors.white) {
      this.moveIndex--;
    }
    let sans = []
    moves.forEach(m=> {
      sans.push(m.move);
    })
    this.board.makeMoves(sans);
    this.fetchBookMove(move);
  }

  //for context menu on moves
  onContextClick(event: MouseEvent, item) {
    // preventDefault avoids to show the visualization of the right-click menu of the browser
    event.preventDefault();

    // we record the mouse position in our object
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';

    // we open the menu
    // we pass to the menu the information about our object
    this.matMenuTrigger.menuData = {item: item}

    // we open the menu
    this.matMenuTrigger.openMenu();

  }

  onSideMoveContextClick(event) {
    let mouseEvent = event.event;
    let move = event.move
    this.onContextClick(mouseEvent, move)
  }

  onFenEnter(fen) {
    this.gameStarted = true;
    this.currentFen = fen;
    this.chess = new this.Chess(fen);
    this.initialPosition = fen;
    this.allowSetPosition = false
    this.runStockFishForFen(fen);
    this.runStockFishEvalForFen(fen)
    this.phase = findGamePhase(this.currentFen)
    this.analyticService.recordPositionAnalysis(0);
    this.positionAnalysisMode = true
    this.moveIndex = getHalfMoveNumberFromFen(fen)
    this.analysisBeginsOnMoveNumber = this.moveIndex;
    this.moveIndex--;
  }

  setMoveCategory(move : Move, moveCategory) {
    switch(moveCategory) {
      case 'brilliant' :
        move.moveCat = MoveCategory.BRILLIANT.toString()
        break;
      case 'best' :
        move.moveCat = MoveCategory.BEST.toString()
        break;
      case 'good' :
        move.moveCat = MoveCategory.GOOD_MOVE.toString()
        break;
      case 'dubious' :
        move.moveCat = MoveCategory.DUBIOUS.toString()
        break;
      case 'mistake' :
        move.moveCat = MoveCategory.MISTAKE.toString()
        break;
      case 'blunder' :
        move.moveCat = MoveCategory.BLUNDER.toString()
        break;
      case 'book' :
        move.moveCat = MoveCategory.BOOK_MOVE.toString()
        break;
    }
  }

  addMoveComment(move) {
    const dialogRef = this.dialog.open(AddCommentDialogue, {
      data: {move},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.comment)
        move.comment = result.comment;
    })
    this.annotatedMovesCount++;
    this.checkReviewCompletionEligibility();
  }

  checkReviewCompletionEligibility() {
    this.eligibleForReviewCompletion = (this.trainingMode && this.annotatedMovesCount >= this.MIN_ANNOTATION_REQUIRED &&
                                        this.gameNotes != null && this.gameNotes.trim().length > 0)
  }

  showComment(move) {
    if(move.comment) {
      const dialogRef = this.dialog.open(ShowCommentDialogue, {
        data: {move},
      });
    }
  }

  fetchBookMove(move : Move) {
    if(!this.bookMoveEnds) {
      let moves = this.moveCollection.createMoveSequence(move);
      let moveOrder = this.createMoveOrder(moves);
      if(moveOrder && moveOrder.trim().length > 0) {
        moveOrder = moveOrder.trim();
        this.service.getOpeningForMoves(moveOrder).subscribe(opening=> {
          if(opening && opening.body) {
            this.openingName = opening.body["opening"];
            this.openingName = this.openingName.split("(").join(" ").split(")").join(" ");
            move.moveCat = MoveCategory.BOOK_MOVE.toString()
          }
        }, error=> {
          this.bookMoveEnds = true;
        })
      }

    }
  }

  onPgnEnter(pgn) {
    this.parsingPgn = true;
    this.gameAnalysisMode = true;
    this.service.parsePgn(pgn).subscribe(response=> {
      if(response && response.body) {
        let game = response.body[0];
        let moveStr = this.getMoves(game);
        let md5Str = md5(moveStr);
        this.currentGame = game;
        this.currentPgn = pgn;
        this.parsingPgn = false;
        this.gameStarted = true;
        this.prepareMoves(game, pgn);
        if(game.otherDetails["FEN"]) {
          this.board.loadFen(game.otherDetails["FEN"])
          this.initialPosition = game.otherDetails["FEN"];
          this.moveIndex = getHalfMoveNumberFromFen(game.otherDetails["FEN"])
        }
        if(this.savedAnalysis && this.savedAnalysis.length > 0) {
          let analysis = this.savedAnalysis.filter(a=> a.md5 == md5Str)
          if(analysis && analysis.length > 0) {
            this.loadAnalysis(analysis[0])
            return;
          } else {
            //this.runAnalysisForGame(game, pgn)
          }
        } else {
          this.storageService.getAllAnalysis().subscribe(analysis=> {
            if(analysis) {
              this.savedAnalysis = analysis;
            } else {
              this.savedAnalysis = [];
            }
            if(this.savedAnalysis && this.savedAnalysis.length > 0) {
              let analysis = this.savedAnalysis.filter(a=> a.md5 == md5Str)
              if(analysis && analysis.length > 0) {
                this.loadAnalysis(analysis[0])
                return;
              } else {
                //this.runAnalysisForGame(game, pgn)
              }
            } else {
              //this.runAnalysisForGame(game, pgn)
            }
          })
        }
        if(this.trainingMode) {
          this.bottomSheet.open(BottomSheetOverviewExampleSheet)
        }
      }

    })

  }
  prepareMoves(game : Game, pgn : string) {
    let tmpChess = new this.Chess();
    let gameLoaded = tmpChess.loadPgn(pgn, {sloppy:true});
    if(!gameLoaded) {
      this.snackbar.open("Can't load the game", "close")
      return;
    }
    //tmpChess.reset()

    for(let index = 0; index < game.moves.length; index++) {
      tmpChess.undo();
    }
    let turn = tmpChess.turn();
    for(let index = 0; index < game.moves.length; index++) {
      if(turn == 'w') {
        game.moves[index].playedBy = ChessColors.white
        turn = 'b'
      } else {
        game.moves[index].playedBy = ChessColors.black;
        turn = 'w'
      }
      let m = tmpChess.move(game.moves[index].move);
      game.moves[index].from = m.from
      game.moves[index].to = m.to;
      this.playedMoves.push(game.moves[index])
      this.moveCollection.addMove(game.moves[index])
    }
  }
  runAnalysisForGame(game, pgn) {
    this.playedMoves = this.moveCollection.getMoveArray();
    this.moveCollection.reset();
    if(this.playedMoves) {
      this.gameAnalysisOn = true;
      let gameAnalyzer = new StockfishGameAnalyzer(this.playedMoves, this.GAME_ANALYSIS_DEPTH, moves=> {
        this.playedMoves = moves;
        this.gameAnalysisOn = false;
        this.analysisCompleted = true;
        moves.forEach(m=> {
          this.moveCollection.addMove(m)
        })
        this.loadFeedbackForm();
      }, progress=> {
        this.gameAnalysisProgess = ((progress / this.playedMoves.length) * 100)
      })
    }
    this.analyticService.recordGameAnalysis(game.opening, game.moveCount > 0 ? game.moveCount: game.moves.length/2);
  }

  getMoves(game: Game) {
    let str = "";
    if(game && game.moves) {
      game.moves.forEach(m=> {
        str+=m.move+" ";
      })
    }
    return str.trim();
  }

  toggleShowBestMove(val) {
    this.showBestMove = val;
  }

  toggleFullEvalView(val) {
    this.showFullAnalysis = val;
  }


  showSparePieces() {
    this.allowSetPosition = true;
  }

  onPositionSetComplete(fen) {
    this.onFenEnter(fen)
    this.allowSetPosition = false;
  }

  playAgainstEngine() {
    let base64Fen = btoa(this.currentFen)
    this.router.navigate(["play-against-chess-bots"],{queryParams: {"fen":base64Fen}})
  }

  onPositionChange(fen) {
    this.setupFen = fen;
  }

  createMoveOrder(movesPlayed : Move[]) {
    let moveOrder = "";
    if(movesPlayed.length > 0) {
      let moveSeq = "";
      for(let index=1; index<=movesPlayed.length; index++) {
        if(index % 2 != 0) {
          let moveNum = index / 2;
          moveNum = Math.ceil(moveNum)
          moveSeq = moveSeq + " " + moveNum + ". " + movesPlayed[index -1].move
        } else {
          moveSeq = moveSeq + " " + movesPlayed[index -1].move
        }
      }
      moveOrder = moveSeq;
    } else {
      moveOrder = "";
    }
    return moveOrder;
  }

  onSelectionChange(index) {
    if(index == 1) {
      this.runStockFishEvalForFen(this.currentFen)
    } else {
      if(index == 2) {

      }
    }

    this.selectedTab.setValue(index)
  }

  saveAnalysis() {

    const dialogRef = this.dialog.open(AnalysisNameDialog, {
      data: {
        name : this.openingName
      },
    });
    dialogRef.afterClosed().subscribe(dResult => {
      if(dResult.name) {
        let name = dResult.name;
        let result = this.gameResult ? this.gameResult : "*"
        let pgn = exportPgn(this.playedMoves, result, this.initialPosition)
        let moveStr = this.getMoves({
          moves : this.moveCollection.getMoveArray()
        });
        let md5Str = md5(moveStr);
        let date  = new DatePipe().transform(new Date().toString());
        let analysisObject : AnalysisStorageSchema = {
          pgn : pgn,
          moves : this.playedMoves,
          eco : this.openingName,
          date : date,
          md5 : md5Str,
          name : name,
          notes : this.gameNotes
        }
        if(this.trainingMode && this.eligibleForReviewCompletion) {
          this.store.dispatch(new GameReviewed(this.trainingGameId, analysisObject));
        }
        this.storageService.addAnalysis(analysisObject).subscribe(result=> {
          if(result) {
            this.showStoargeWarning = true;
            this.snackbar.open("We save the game analysis only in your browser cache", "close")
          }
        },error=> {
          this.snackbar.open("We Couldn't save analysis due to some problem", "close")
        });
      }

    })

  }

  hideStorageWarning() {
    this.showStoargeWarning = false;
  }

  onShowSavedAnalysisClick(show : boolean) {
    this.showSavedAnalysis = show;
    if(show) {
      this.storageService.getAllAnalysis().subscribe(analysis=> {
        if(analysis) {
          this.savedAnalysis = analysis;
        } else {
          this.savedAnalysis = [];
        }
      })
    }
  }

  loadAnalysis(analysis : AnalysisStorageSchema) {
    //this.openingName = analysis.eco;
    this.playedMoves = analysis.moves;
    this.gamePgnStr = analysis.pgn;
    this.showSavedAnalysis = false;
    this.gameStarted = true;
    analysis.moves.forEach(m=> {
      this.moveCollection.addMove(m)
    })
    this.moveCollection.reset()
  }

  deleteAnalysis(analysis : AnalysisStorageSchema) {
    this.storageService.deleteAnalysis(analysis["id"]).subscribe(result=> {
      if(result) {
        this.savedAnalysis = this.savedAnalysis.filter(a=> a.id != analysis.id)
      }
    }, error=> {
      this.snackbar.open("Some problem occured while deleting analysis")
    })
  }

  moveNext() {
    let white = this.chess.turn() == 'w' ? true : false;
    let move = this.moveCollection.getLastPlayedMove();

    if(move.next) {
      if(!move.next.isSideMove) {
        this.setPosition(move.next, !white)
      } else {
        this.onMoveClick(move.next)
      }
    }
  }

  moveBack(){
    let white = this.chess.turn() == 'w' ? false : true;
    let move = this.moveCollection.getLastPlayedMove();
    if(move.prev) {
      if(!move.prev.isSideMove) {
        this.setPosition(move.prev, !white)
      }
      else
        this.onMoveClick(move.prev)
    } else {
      this.playedMoves = []
      this.moveCollection = new MoveCollection()
      this.board.loadFen(this.initialPosition)
      this.chess.undo()
    }
  }

  stopAnalysis() {
    this.engineWorker.postMessage("stop")
  }

  toggleShowFen(val) {
    this.showFen = val;
  }

  toggleEngineLines(val) {
    this.showEngineLines = val;
  }

  startEvaluation() {
    if(this.currentGame && this.currentPgn) {
      this.runAnalysisForGame(this.currentGame, this.currentPgn);
    } else {
      this.snackbar.open("No Game is entered yet", "close")
    }
  }

  loadFeedbackForm() {
    if(this.feedbackNotAsked) {
      let timer = setInterval(()=> {
        if(this.countDownTimer >= this.FEEDBACK_WAIT_TIME_IN_SECONDS) {
          this.feedbackService.popupFeedback("engine", this.store);
          clearInterval(timer)
        } else {
          this.countDownTimer++;
        }
      }, 1000)
      this.feedbackNotAsked = false;
    }

  }

  ngAfterViewInit() {
    this.scrollToTitle();
  }

  scrollToTitle() {
    setTimeout(() => {
      document.getElementById("chess-board-container").scrollIntoView();
    }, 300);

  }

  async togglePlay() {
    let count = 0;
    if(!this.autoPlay) {
      this.autoPlay = true;
      if(!this.lastPlayedMove) {
        let firstMove = this.moveCollection.getMoveArray()[0];
        this.setPosition(firstMove,
          firstMove.playedBy == ChessColors.black)
          await new Promise(r => setTimeout(r, 1000));
          if(firstMove.from && firstMove.to)  {
            drawArrowBetweenSquare(firstMove.from, firstMove.to, this.boardId);
          }
      }
      while(this.lastPlayedMove.next && this.autoPlay) {
        if(this.autoPlay) {
          this.setPosition(this.lastPlayedMove.next,
            this.lastPlayedMove.next.playedBy == ChessColors.black)
          count++;
          await new Promise(r => setTimeout(r, 1000));
          removeAllSquareConnectingArrow(this.boardId);
          if(this.lastPlayedMove.next.from && this.lastPlayedMove.next.to)  {
            drawArrowBetweenSquare(this.lastPlayedMove.next.from,
              this.lastPlayedMove.next.to, this.boardId);
          }
          this.onlyAttacks = true

        }


      }

    } else {
      this.autoPlay = false;
    }
  }

  deleteMove(move : Move) {
    if(move && move.prev) {
      if(move.prev.next.move == move.move)
        move.prev.next = null;
      else {
        let sideMoveArrayIndex = 0;
        let arr = move.prev.next.sideMovesArray
        for(let i = 0; i< move.prev.next.sideMovesArray.length; i++) {
          if(move.prev.next.sideMovesArray[i][0].move == move.move) {
            sideMoveArrayIndex = i;
            break
          }
        }
        move.prev.next.sideMovesArray = []
        for(let i = 0; i< arr.length; i++) {
          if(i != sideMoveArrayIndex) {
            move.prev.next.sideMovesArray.push(arr[i])
          }
        }
      }
      this.moveCollection.setLastPlayedMove(move.prev)
      this.playedMoves = this.moveCollection.getMoveArray();
      this.setPosition(move.prev , move.prev.playedBy == ChessColors.black)
    }
  }

  @HostListener('document:keydown.arrowright', ['$event']) onArrowRightHandler(event: KeyboardEvent) {
    this.moveNext()
  }

  @HostListener('document:keydown.arrowleft', ['$event']) onArrowLeftHandler(event: KeyboardEvent) {
    this.moveBack();
  }

  @HostListener('document:keydown.scrolllock', ['$event']) onScrollLockHandler(event: KeyboardEvent) {
    if(this.scrollLocked) {
      resumedScrollForce()
    } else {
      stopScrollForce()
    }
    this.scrollLocked = !this.scrollLocked
  }

  @HostListener('document:keydown.control.shift.c', ['$event']) onCLearArrows(event: KeyboardEvent) {
    removeAllSquareConnectingArrow(this.boardId)
  }

  @HostListener('document:keydown.alt.p', ['$event']) onPlay(event: KeyboardEvent) {
    this.togglePlay()
  }



}

@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  templateUrl: 'bottom-sheet.html',
})
export class BottomSheetOverviewExampleSheet {
  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>) {}

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}



