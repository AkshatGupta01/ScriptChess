import { Component, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { generateRandomID } from 'src/app/util/strings';
import * as ChessJS from 'src/app/util/chessjs/chess';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { AudioService } from 'src/app/services/audio.service';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Bot } from 'src/app/models/bots';
import { bots, noviceBots } from 'src/app/static-data/bots';
import { StorageService } from 'src/app/services/storage.service';
import { GameStorageSchema } from 'src/app/models/storage-models';
import { DatePipe } from 'src/app/pipes/date.pipe';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';
import { getDepthForRating, getStockfishPath } from 'src/app/util/stockfish-util';
import { FeedbackService } from 'src/app/services/feedback.service';
import { ChessBoardComponent } from 'src/app/common/chess-board/chess-board.component';
import { Store } from '@ngrx/store';
import { Meta, Title } from '@angular/platform-browser';
import { metaMap } from 'src/app/static-data/meta';
import { BotPlayed } from 'src/app/rx/training/training.action';
import { TrainingReport } from 'src/app/models/training';
import { environment } from 'src/environments/environment';


declare function highlightMoves(move, id);
declare function removeHighlights(boardId);
export interface DialogData {
  result: string;
  pgn : string;
  restart : boolean;
  save : boolean;
  white : string
  black : string
  eco : string
  moveCount : number,
  gameId? : number
}

@Component({
  selector: 'app-noob-computer',
  templateUrl: './noob-computer.component.html',
  styleUrls: ['./noob-computer.component.scss']
})
export class NoobComputerComponent implements OnInit, OnDestroy {

  movePairs : any[] = []
  boardId : string | undefined
  initialFen : string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  moveIndex = 0;
  contMoveIndex= 0;
  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  chess = new this.Chess();
  worker : any;
  movesPlayed = 0;
  @ViewChild(ChessBoardComponent) chessBoard: ChessBoardComponent;
  board : ChessBoardComponent;
  engineDepth = 1;
  maxDepth = 20;
  minDepth = 1;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  changeEngineDepthDisabled = false;
  engineThinking = false;
  botName : string
  botElo : number
  playerColor : string;
  whiteOrientated : boolean = true;
  cheatingMode: boolean;
  cheatingMoveCount : number = 0;
  lastCheatingMoveIndex = 0;
  comment : string;
  botImageLoc : string
  engineRegistered: boolean;
  whitePlayer : string
  blackPlayer : string
  lastResignClicked : number;
  lastNewGameClicked : number;
  epicBots : Bot[]
  beginnersBots : Bot[]
  selectedBot : Bot
  opening : string
  openingOver : boolean = false;
  savedGames : GameStorageSchema[]
  gameId: number = 0;
  feedbackNotAsked = true;
  FEEDBACK_WAIT_TIME_IN_MINUTES: number = 60;
  countDownTimer: number = 0;
  trainingMargingRating = 300;
  trainingMode = false;
  botsForTraining : Bot[] = []
  trainingRating = 0
  constructor(public dialog: MatDialog, private audioService  :AudioService, private analyticService: AnalyticsService,
    private activatedRoute : ActivatedRoute, private snackbar : MatSnackBar, private storageService : StorageService,
    private service :ScriptChessServiceService, private router : Router,
    private feedbackService : FeedbackService, private renderer2 : Renderer2, private store : Store, private title :Title, private meta : Meta) {
    this.boardId = generateRandomID(5).trim();
    this.registerStockFish()
    this.epicBots = bots
    this.beginnersBots = noviceBots;
    this.loadSavedGames();
  }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    if(this.meta.getTag("description")) {
      this.meta.updateTag({'name': 'description', content: metaMap["Bots"].description})
    } else {
      this.meta.addTag({'name': 'description', content: metaMap["Bots"].description})
    }
    this.title.setTitle(metaMap["Bots"].title)
    this.activatedRoute.queryParams.subscribe(params=> {
      if(params && params["fen"]) {
        let fen = params["fen"];
        fen = atob(fen);
        this.chess = new this.Chess(fen);
        this.initialFen = fen;
        //this.chessBoard.loadFen(fen)
        this.playerColor = this.chess.turn();
        this.whiteOrientated = this.playerColor == 'w'

      } else {
        if(params["mode"] == "training") {
          this.trainingMode = true;
          this.trainingRating = Number.parseInt(params["rating"])
          this.checkTrainingModeCompletion();
          if(this.trainingMode)
            this.prepareTrainigMode();

        } else {
          this.chess.reset();
        }

      }
    })
  }

  prepareTrainigMode() {
    this.beginnersBots.forEach(bot=> {
      if(bot.elo >= this.trainingRating && bot.elo < (this.trainingRating + this.trainingMargingRating)) {
        this.botsForTraining.push(bot)
      }
    })
    this.epicBots.forEach(bot=> {
      if(bot.elo >= this.trainingRating && bot.elo < (this.trainingRating + this.trainingMargingRating)) {
        this.botsForTraining.push(bot)
      }
    })
  }


  loadChessBoard() {
    setTimeout(()=>{
      this.activatedRoute.queryParams.subscribe(params=> {
        if(params && params["fen"]) {
          let fen = params["fen"];
          fen = atob(fen);
          this.chess = new this.Chess(fen);
          this.chessBoard.loadFen(fen);
          this.setChessHeaders()
        } else {
          this.chess.reset();
          this.setChessHeaders();
          if(this.playerColor != this.chess.turn()) {
            this.getMoveFromStockFish(this.initialFen);
          }
        }
      })
    }, 500)

  }

  scrollParentToChild(parent, child) {

    // Where is the parent on page
    var parentRect = parent.getBoundingClientRect();
    // What can you see?
    var parentViewableArea = {
      height: parent.clientHeight,
      width: parent.clientWidth
    };

    // Where is the child
    var childRect = child.getBoundingClientRect();
    // Is the child viewable?
    var isViewable = (childRect.top >= parentRect.top) && (childRect.bottom <= parentRect.top + parentViewableArea.height);

    // if you can't see the child try to scroll parent
    if (!isViewable) {
          // Should we scroll using top or bottom? Find the smaller ABS adjustment
          const scrollTop = childRect.top - parentRect.top;
          const scrollBot = parentRect.bottom / 2;
          if (Math.abs(scrollTop) < Math.abs(scrollBot)) {
              // we're near the top of the list
              parent.scrollTop += scrollTop;
          } else {
              // we're near the bottom of the list
              parent.scrollTop += scrollBot;
          }
    }

  }

  onMove(moveDetails, board) {
    if(!this.board) {
      this.board = board;
    }
    //if wrong color was played
    if(!moveDetails["botMoves"]) {
      if(this.playerColor == 'w' && moveDetails["whiteTurn"]) {
        this.chessBoard.loadFen(this.chess.fen());
        this.snackbar.open("It's not your turn", "close")
        return
      }
    }
    this.contMoveIndex++;
    let chessMove = null;
    if(moveDetails.move.san)
      chessMove = this.chess.move(moveDetails.move.san);
    else {
      chessMove = this.chess.move(moveDetails.move);
    }
    if(chessMove) {
      if(moveDetails.whiteTurn)
      this.moveIndex++;
      let move = {
        move : moveDetails.move.san,
        moveNumber : this.moveIndex
      }
      if(moveDetails.whiteTurn) {
        if(this.movePairs.length > 0) {
          this.movePairs[this.movePairs.length -1]['black'] = move
        } else {
          let movePair = {}
          movePair["black"] = move;
          this.movePairs.push(movePair)
        }

      } else {
        let movePair = {}
        movePair["white"] = move;
        this.movePairs.push(movePair)
      }
      this.movesPlayed++;
      let result = this.checkResult();
      if(!result) {
        let turn = this.chess.turn()
        if(turn != this.playerColor) {
          let fen = this.chess.fen();
          this.getMoveFromStockFish(fen);
        }
      } else {
        if(result.startsWith("Checkmate")) {
          if(moveDetails["whiteTurn"]) {
            if(this.playerColor == 'w') {
              this.audioService.playLoseAudio();
              this.gameOver("Sorry!! you lost :(", board)
            } else {
              this.audioService.playWinAudio();
              this.gameOver("Yey!! You Won :)", board)
            }

          } else {
            if(this.playerColor == 'b') {
              this.audioService.playLoseAudio();
              this.gameOver("Sorry!! you lost :(", board)
            } else {
              this.audioService.playWinAudio();
              this.gameOver("Yey!! You Won :)", board)
            }
          }


        } else {
          this.audioService.playDrawAudio()
          this.gameOver(result + " :|", board)
        }
      }
      removeHighlights(this.boardId)
      highlightMoves(chessMove, this.boardId)
      this.fetchOpening()
      this.updateCheckComment()
    }

  }

  updateCheckComment() {
    if(this.chess.inCheck) {
      let turn = this.chess.turn()
      if(turn == this.playerColor) {
        this.comment = this.selectedBot.comments.checkGievn
      } else {
        this.comment = this.selectedBot.comments.checkReceived
      }
    }
  }

  checkResult() {
    let result = null;
    if(this.chess.isGameOver()) {
      result = this.chess.isStalemate() ? "Draw by Stalemate" : null;
      if(!result) {
        result = this.chess.isCheckmate() ? "Checkmate" : null;
      }
      if(!result) {
        result = this.chess.isDraw() ? "Draw" : null;
      }
      if(!result) {
        result = this.chess.isInsufficientMaterial() ? "Draw by in-sufficient material" : null;
      }

      if(!result) {
        result = this.chess.isThreefoldRepetition() ? "Draw by 3 fold Repetition" : null;
      }
    }
    return result;
  }

  createMoveOrder() {
    let moveOrder = "";
    let index = 1;
    if(this.movePairs && this.movePairs.length> 0) {
      this.movePairs.forEach(p=> {
        if(p["black"]) {
          moveOrder += index +". " + p["white"].move +" " + p["black"].move+" "
        } else {
          moveOrder += index +". " + p["white"].move
        }
        index++;
      })
    }
    return moveOrder;
  }

  gameOver(result : string, board : ChessBoardComponent) {
    if(this.trainingMode) {
      this.store.dispatch(new BotPlayed());
      this.checkTrainingModeCompletion();
    }
    let self = this;
    let white = this.playerColor == 'w' ? "Player" : this.selectedBot.name
    let black = this.playerColor == 'b' ? "Player" : this.selectedBot.name
    let stat = {
      result : result,
      moveCount : this.movePairs.length,
      white,
      black,
      eco : this.opening
    }
    this.analyticService.recordNoobPlayerGameOver(stat)

    let symResult = result.indexOf('Won') > -1 ? "Won" : result.indexOf('Draw') > -1 ? "Draw":"Lost"
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {
          result : symResult,
          pgn : this.chess.pgn({ maxWidth: 35, newline: '\n' }),
          eco : this.opening,
          white,
          black,
          moveCount:this.movePairs.length
        },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result)
        return
      if(result.restart) {
          this.playerColor = this.playerColor == 'w' ? 'b' : 'w'
          this.chess.reset();
          this.whiteOrientated = !this.whiteOrientated;
          setTimeout(()=>{
            this.chessBoard.resetBoard();
          }, 300)

          this.movePairs = [];
          if(this.playerColor == 'b') {
            setTimeout(() => {
              this.getMoveFromStockFish(this.chess.fen())
            }, 1300);
          }
      } else {
        this.gameId = result.gameId
      }
      self.loadFeedbackForm();
    });
  }

  registerStockFish() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      this.worker = new Worker(new URL(getStockfishPath()));
      this.worker.onmessage = ({ data }) => {

        if(data === "uciok") {
          this.engineRegistered = true;
        }
        if(data && (data+"").startsWith("bestmove")) {
          this.engineThinking = false;
          let match = data.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);

          let move = this.chess.move({from: match[1], to: match[2], promotion: match[3]});
          this.chess.undo();
          if(this.chessBoard)
            this.chessBoard.makeMove(move.san);
          else {
            setTimeout(()=>
            this.chessBoard.makeMove(move.san),300
            )
          }
          let whiteTurn = this.playerColor == 'b' ? false : true
          let moveDetail = {
            move : {san : move.san},
            whiteTurn,
            botMoves : true
          }
          let result = this.checkResult();
          this.onMove(moveDetail, this.chessBoard)
          this.chessBoard.loadFen(this.chess.fen())
          highlightMoves(move, this.boardId)
        } else {
          let match = data.match(/^info depth (\d+) .*\bscore (\w+) (-?\d+).*\bpv (.*)/)

          if(match) {
            if(this.selectedBot.cheater) {
              var tmpScore = parseInt(match[3]) * (this.chess.turn() == 'w' ? 1 : -1);
              if(match[2] == 'cp') {
                tmpScore = (tmpScore / 100.0)
                if(((this.playerColor == 'w' && tmpScore > 0) || (this.playerColor == 'b' && tmpScore < 0)) && this.moveIndex > 15) {
                  if(Math.abs(this.lastCheatingMoveIndex - this.moveIndex) > 4) {
                    this.cheatingMode = true;
                    this.lastCheatingMoveIndex = this.moveIndex;
                  }
                }
              }
            }
            else {
              if(match[2] == 'mate') {
                if((this.playerColor == 'w' && tmpScore < 0) || (this.playerColor == 'b' && tmpScore > 0)) {
                  this.comment = this.selectedBot.comments.mateSeqGiven
                }
                else {
                  this.comment = this.selectedBot.comments.mateSeqReceived
                }
              }
            }
          }

        }
      }
      this.worker.postMessage("uci")
    }
  }

  getMoveFromStockFish(fen : string) {
    this.engineThinking = true;
    this.changeEngineDepthDisabled = true;
    this.worker.postMessage('position fen ' + fen);
    if(this.cheatingMode) {
      this.worker.postMessage(`go depth ` + 25)
      this.cheatingMode = false;
      this.comment = this.selectedBot.comments.cheating
    } else {
      this.worker.postMessage(`go depth ` + this.engineDepth)
    }

  }

  updateEngineDepth(event : any) {
    if(event && event.value > 0) {
      this.engineDepth = event.value;
    }
  }

  setBot(bot : Bot, color) {
    this.botName = bot.name;
    this.botElo = bot.elo;
    this.selectedBot = bot;
    this.engineDepth = getDepthForRating(bot.elo)
    this.playerColor = color == 'white' ? 'w' : 'b';
    this.whiteOrientated = this.playerColor == 'w'
    this.loadChessBoard();
    this.comment = bot.comments.opening
    this.analyticService.recordBotsClicked(bot.name, color)
    if(color == 'white') {
      this.whitePlayer = "Future Super GM"
      this.blackPlayer = bot.name
    } else {
      this.whitePlayer = bot.name
      this.blackPlayer = "Future Super GM"
    }
    this.movePairs = []
    window.scroll(0,0);
    this.scrollToTitle();
  }

  setChessHeaders() {
    if(this.playerColor == 'black') {
      this.chess.header("White", "Furture Super GM", "Black", this.botName, "Black Elo", this.botElo+"", "White Elo", "?", "Event","Game againt Epic Bot Scriptchess.com")
    } else {
      this.chess.header("Black", "Furture Super GM", "White", this.botName, "White Elo", this.botElo+"", "Black Elo", "?", "Site","https://scriptchess.com")
    }
  }

  resign() {
    if(this.movePairs.length < 10) {
      this.snackbar.open("Play atleast for 10 moves, before resigning", "close");
      return
    }
    let now = new Date().getTime();
    let diff = now - this.lastResignClicked;
    if(diff <= 2000) {
      let result = ""
      if(this.playerColor == 'white') {
        result = "0-1"
      } else {
        result = "1-0"
      }
      this.snackbar.dismiss();
      this.lastResignClicked = 0;
      this.gameOver(result, this.chessBoard);

    } else {
      this.lastResignClicked = now;
      this.snackbar.open("Click again to resign", "close");
    }
  }

  newGame() {
    let now = new Date().getTime();
    let diff = now - this.lastNewGameClicked;
    if(diff <= 2000) {
      this.engineDepth = 1;
      this.lastNewGameClicked = 0;
    } else {
      this.lastNewGameClicked = now;
      this.chess.reset();
      this.playerColor = null;
      this.snackbar.open("Click again to start new game", "close");
    }
  }

  fetchOpening() {
    if(!this.openingOver) {
      this.service.getOpeningForMoves(this.createMoveOrder()).subscribe(result=> {
        if(result && result.body) {
          this.opening = result.body["opening"];
        }
      }, error=> {
        this.openingOver = true;
      })
    }


  }

  loadSavedGames() {
    this.storageService.getAllGames().subscribe(games=> {
      if(games) {
        this.savedGames = games
      } else {
        this.savedGames = []
      }
    })
  }

  deleteGame(item) {
    this.storageService.deleteGame(item.id).subscribe(result=> {
      if(result) {
        this.savedGames = this.savedGames.filter(g=> g.id != item.id)
      }
    })
  }

  analyzeGame(item) {
    this.router.navigate(["/free-chess-engine"],{queryParams: {"gameId":item.id}})
  }

  analyzeLastGame() {
    this.router.navigate(["/free-chess-engine"],{queryParams: {"gameId":this.gameId}})
  }

  loadFeedbackForm() {
    if(this.feedbackNotAsked) {
      this.feedbackService.popupFeedback("bot", this.store);
      this.feedbackNotAsked = false;
    }
  }

  scrollToTitle() {
    setTimeout(() => {
      document.getElementById("chess-board-container").scrollIntoView();
    }, 300);

  }

  checkTrainingModeCompletion() {
    let reportStr = localStorage.getItem("trainingReport");
      if(reportStr) {
        let report : TrainingReport = JSON.parse(reportStr);
        if(report.botsGames == environment.botsGamesToBePlayed) {
          this.snackbar.open("You have completed all training bots games, exiting ttraining mode", "close")
          this.trainingMode = false;
        }
      }
  }
}






@Component({
  selector: 'restart-game',
  templateUrl: 'restart-game.html',
})
export class DialogOverviewExampleDialog {
  saved : boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private storageService : StorageService
  ) {
    let date = new DatePipe().transform(new Date().toString())
      let game : GameStorageSchema = {
        pgn : this.data.pgn,
        white : this.data.white,
        black : this.data.black,
        result : this.data.result,
        date,
        moveCount : this.data.moveCount,
        eco : data.eco
      }
      this.storageService.addGame(game).subscribe(game=> {
        if(game) {
          this.saved = true;
          data.gameId = game.id;
        }
      })
  }

  onNoClick(): void {
    this.data.restart = false
    this.dialogRef.close(this.data);
  }

  onYesClick(): void {
    this.data.restart = true
    this.dialogRef.close(this.data)
  }



}
