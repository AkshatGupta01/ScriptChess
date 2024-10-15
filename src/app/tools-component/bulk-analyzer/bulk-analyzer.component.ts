import { Comment } from 'src/app/models/comment';
import { PieceSymbol } from './../../util/chesstmp';
import { Move, MoveDetails } from './../../models/move';
import { md5 } from './../../util/md5';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Analysis, Game } from 'src/app/models/game';
import { GameAction, GameSelector } from 'src/app/rx/games';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';
import { StockfishGameAnalyzer } from 'src/app/util/stockfish-game-analyzer';
import { environment } from 'src/environments/environment';
import * as ChessJS from 'src/app/util/chessjs/chess';
import { ECO, EcoModel } from 'src/app/models/eco';
import { BulkAnalyzerSummary } from 'src/app/models/bulk-analyzer-summary';
import { findGamePhase } from 'src/app/util/game-phase-finder';
import { Puzzle } from 'src/app/models/puzzle';
import { AnalysisStorageSchema, GameStorageSchema } from 'src/app/models/storage-models';
import { StorageService } from 'src/app/services/storage.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { ChartType } from 'angular-google-charts';
import { ChessBoardComponent } from 'src/app/common/chess-board/chess-board.component';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { TrainingReport } from 'src/app/models/training';
import { selectTrainingReport } from 'src/app/rx/training/training.selector';
import { analyzeWeakness, getMaterialDifference } from 'src/app/util/fen-validator';
import { PositionAnalysisForBothSide } from 'src/app/models/weaknesses';
import { getMonth } from 'src/app/util/strings';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogue } from '../training/warning.component';
import { SummaryDialog } from './summary.dialog.component';
import { MaxAnalysisWarning } from './max-analysis-warning';
import { AlertDialogeComponent } from 'src/app/common/alert-dialoge/alert-dialoge.component';

declare function removeAllSquareConnectingArrow(id): any
declare function drawArrowBetweenSquare(s1,s2,id, color) : any
declare function loadArrowSupport(id): any
@Component({
  selector: 'app-bulk-analyzer',
  templateUrl: './bulk-analyzer.component.html',
  styleUrls: ['./bulk-analyzer.component.scss']
})
export class BulkAnalyzerComponent implements OnInit {

  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  chess = new this.Chess();
  month = "0";
  year = "0";
  monthStr = "";
  chessDotComMode = false;
  games: Game[] = []
  analyzer: StockfishGameAnalyzer
  currentGame: Game
  currentIndex = 0;
  username: string
  winner: string;
  color: string;
  filteredGames: Game[] = []
  ngUnsubscribe = new Subject < void > ();
  loadingEcos: boolean = false;
  ecos: EcoModel[]
  expandedGame: Game
  selectedGames: Game[] = []
  summary: BulkAnalyzerSummary
  practicePositions: Puzzle[] = []
  top5LossesInOpening: any[];

  currentPuzzle: Puzzle
  currentPuzzleIndex = 0
  depth = 1;
  blankRequestMode = false;
  uploadedPgns: any[]
  uploadedFiles: any[]
  downloadingGames = false;
  chartType: ChartType
  barChartType: ChartType
  openingAnalysisSummaryData: any
  middleGameAnalysisSummaryData: any
  endgameAnalysisSummaryData: any
  chartOptions: any;
  pieceAnalysisData: any
  pieceAccuracyData: any
  fullWidth = "100%"
  whiteAdvantageLostData: any
  blackAdvantageLostData: any
  currentMoves: MoveDetails[];
  currentFen: string = ""
  currentMoveIndex: number = 0
  playedFens = []
  playedMoves = []
  noMoveAvailable = false;
  @ViewChild("playerName")
  playerName: any
  fenMovesMap: any;
  currentScore: string = ""
  analysisStarted = false
  analysisCompleted = false
  initialPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  boardid = "analyzed-game-explorer"
  gamesFromLine: Game[] = []
  stopRequested = false;
  globalProgress = 0
  startedAt: number
  minRapidTimeInSec = 600;
  metadata : any[] = []
  metadataMonths : any[] = []
  error : string = null;
  downloadStarted = false;
  chessDotComGamesSelected = false;

  lichessBlitzSelected = false;
  lichessRapidSelected = false;
  lichessClassicalSelected = false;
  lichessUsername = ""
  selectedView = 0;
  loggedIn = false;
  loadingInsight = false;
  savedAnalysis: BulkAnalyzerSummary[];
  noSavedAnalysis: boolean;
  savingAnalysis: boolean;
  generatingTraining: boolean;
  trainingGenerated: boolean = false;
  constructor(private route: ActivatedRoute, private service: ScriptChessServiceService, private snackbar: MatSnackBar,
      private changeDetecter: ChangeDetectorRef, private store: Store, private storageService: StorageService, private router: Router,
      private clipboard: Clipboard, private analytics: AnalyticsService, public dialog: MatDialog) {
      this.chartType = ChartType.PieChart;
      this.barChartType = ChartType.ColumnChart
      this.chartOptions = {
          backgroundColor: '#2B2F35',
          is3D: true,
          color: '#eee',
          legend: {
              textStyle: {
                  color: '#eee'
              }
          },
          titleTextStyle: {
              color: '#eee'
          },
          colors: ["#8ECAE6", "#FFB703", "#FB8500", "#E2E336", "#023047", "#219EBC"],
          hAxis: {
              textColor: "#eee"
          },
          vAxis: {
              textColor: "#eee"
          }
      }

      let userStr = localStorage.getItem("auth.user");
      if(userStr) {
        let user = JSON.parse(userStr)
        if(user.lichess) {
          this.lichessUsername = user.lichess
        }
        if(user["chess.com"]) {
          this.username = user["chess.com"]
        }
      }
  }

  ngOnInit(): void {
    let userStr = localStorage.getItem("auth.user")
    if(userStr) {
      this.loggedIn = true;
      let user = JSON.parse(userStr)
      this.service.fetchGameInsights(user.id).subscribe(res=> {
        this.savedAnalysis = res.body;
        if(res.body && Object.keys(res.body).length > 0) {
          this.noSavedAnalysis = false;
        } else {
          this.noSavedAnalysis = true;
        }
      })
    } else {
      this.loggedIn = false;
    }
      this.route.queryParams.subscribe(params => {
          if (params["ref"] && params["ref"] == "chess.com") {
              this.month = params["month"]
              this.year = params["year"]
              this.username = params["username"]
              this.chessDotComMode = true;
              this.downloadingGames = true;
              this.service.downloadParsedCHessDotComGames(this.year, this.month, this.username).subscribe(res => {
                  if (res) {
                      this.games = res.body;
                      this.filteredGames = res.body;
                      this.prepareFenMap()
                      this.downloadingGames = false;
                  }
              }, error => {
                  this.snackbar.open("There was some problem and we will look into it", "close")
                  this.downloadingGames = false;
              })
          } else {
              this.blankRequestMode = true;
          }
      })
      this.store.dispatch(new GameAction.FetchTopOpenings(4000))
      this.loadingEcos = true;


      this.service.fetchAllEcos(4000).subscribe(res => {
          this.ecos = res.body;
          this.loadingEcos = false;
          localStorage.setItem("ecos-all", JSON.stringify(this.ecos));
      })
      this.depth = environment.gameAnalysisDepth;
  }

  filterGames() {
      if (!this.username) {
          this.snackbar.open("Please enter your name", "close")
          return;
      }
      let gamesToFilterFrom = this.gamesFromLine && this.gamesFromLine.length > 0 ? this.gamesFromLine : this.games
      if (this.winner && this.winner == "Won") {
          this.filteredGames = gamesToFilterFrom.filter(game => {
              if (this.matchUserName(game.whitePlayer.name) && game.result == "1-0") {
                  return true;
              }
              if (this.matchUserName(game.blackPlayer.name) && game.result == "0-1") {
                  return true;
              }
          })
      }
      if (this.winner && this.winner == "Lost") {
          this.filteredGames = gamesToFilterFrom.filter(game => {
              if (this.matchUserName(game.whitePlayer.name) && game.result == "0-1") {
                  return true;
              }
              if (this.matchUserName(game.blackPlayer.name) && game.result == "1-0") {
                  return true;
              }
          })
      }

      if (this.winner && this.winner == "Draw") {
          this.filteredGames = gamesToFilterFrom.filter(game => game.result == "1/2-1/2")
      }

      let tmpGames = gamesToFilterFrom;
      if (this.winner) {
          tmpGames = this.filteredGames;
      }
      if (this.color && this.color == "White") {
          this.filteredGames = tmpGames.filter(game => this.matchUserName(game.whitePlayer.name))
      }

      if (this.color && this.color == "Black") {
          this.filteredGames = tmpGames.filter(game => this.matchUserName(game.blackPlayer.name))
      }
  }

  startAnalysis() {
    let userStr = localStorage.getItem("auth.user")
    this.summary = null
    let chosenGames = this.selectedGames.length > 0 ? this.selectedGames : this.filteredGames;
    if(userStr && chosenGames. length > environment.maxGameCountPerBulkAnalysis) {
        let dialogRef = this.dialog.open(MaxAnalysisWarning);
        dialogRef.afterClosed().subscribe(data=> {
          if(data == "continue") {
            this.analyzeGames()
          } else {
            if(data == "cancel") {
              return
            }
          }
        })
    }
    this.analyzeGames();
  }

  analyzeGames() {
      if (!this.analysisStarted) {
          this.snackbar.open("Analysis started", "close");
          this.analysisStarted = true;
      }
      this.analysisCompleted = false;

      if (this.loadingEcos) {
          this.snackbar.open("Loading Book moves, Please wait!")
          return
      }
      if (!this.username) {
          this.snackbar.open("Please enter player name. Games will be analyzed from his/her side", "close")
          if (this.playerName) {
              this.playerName.nativeElement.focus();
          }
          return
      }
      //if((this.games.length -1) > this.currentIndex) {
      if (this.currentIndex == 0) {
          this.startedAt = new Date().getTime();
          this.practicePositions = []
      }
      if (this.selectedGames.length > 0 && this.currentIndex >= this.selectedGames.length) {
          this.showAnalysisCompleted()
          return
      }

      if (this.filteredGames.length > 0 && this.currentIndex >= this.filteredGames.length) {
          this.showAnalysisCompleted()
          return
      }

      if (this.selectedGames.length == 0)
          this.currentGame = this.filteredGames[this.currentIndex];
      else
          this.currentGame = this.selectedGames[this.currentIndex];
      this.currentGame.analyzingState = "running"
      this.analyzer = new StockfishGameAnalyzer(this.currentGame.moves, this.depth, this.completionCallback, this.progressCallback, this)

  }

  showAnalysisCompleted() {

      let endsAt = new Date().getTime()
      this.analysisStarted = false;
      this.currentPuzzleIndex = 0;
      if (this.practicePositions.length > this.currentPuzzleIndex) {
          this.currentPuzzle = this.practicePositions[this.currentPuzzleIndex];
      }

      if (this.summary.openingLosses) {
          this.top5LossesInOpening = this.sortObjectByValue(this.summary.openingLosses)
          this.top5LossesInOpening = this.top5LossesInOpening.slice(0, 5);
      }
      this.openingAnalysisSummaryData = []
      this.middleGameAnalysisSummaryData = []
      this.endgameAnalysisSummaryData = []

      this.openingAnalysisSummaryData.push(["Opening mistake", this.summary.totalOpeningMistakes, this.summary.totalOpeningMistakes + " opening mistakes"])
      this.middleGameAnalysisSummaryData.push(["Middlegame mistake", this.summary.totalMiddleGameMistakes])
      this.endgameAnalysisSummaryData.push(["Endgame mistake", this.summary.totalEndgameMistakes])
      this.openingAnalysisSummaryData.push(["Opening Blunder", this.summary.totalOpeningBlunders, this.summary.totalOpeningMistakes + " opening mistakes"])
      this.middleGameAnalysisSummaryData.push(["Middlegame Blunder", this.summary.totalMiddleGameBlunders])
      this.endgameAnalysisSummaryData.push(["Endgame Blunder", this.summary.totalEndgameBlunders])
      this.pieceAccuracyData = []
      this.pieceAccuracyData.push(["Pawn", (1 - (this.summary.pawnAnalysis.mistakes / this.summary.pawnAnalysis.total)) * 100])
      this.pieceAccuracyData.push(["Rook", (1 - (this.summary.rookAnalysis.mistakes / this.summary.rookAnalysis.total)) * 100])
      this.pieceAccuracyData.push(["Bishop", (1 - (this.summary.bishopAnalysis.mistakes / this.summary.bishopAnalysis.total)) * 100])
      this.pieceAccuracyData.push(["Knight", (1 - (this.summary.knightAnalysis.mistakes / this.summary.knightAnalysis.total)) * 100])
      this.pieceAccuracyData.push(["Queen", (1 - (this.summary.queenAnalysis.mistakes / this.summary.queenAnalysis.total)) * 100])
      this.pieceAccuracyData.push(["King", (1 - (this.summary.kingAnalysis.mistakes / this.summary.kingAnalysis.total)) * 100])
      this.whiteAdvantageLostData = []
      this.blackAdvantageLostData = []
      if (this.summary.whiteMiddleAdvantageLost > 0)
          this.whiteAdvantageLostData.push(["Middle Game", this.summary.whiteMiddleAdvantageLost])
      if (this.summary.whiteEndAdvantageLost > 0)
          this.whiteAdvantageLostData.push(["End game", this.summary.whiteEndAdvantageLost])
      if (this.summary.blackMiddleAdvantageLost > 0)
          this.blackAdvantageLostData.push(["Middle Game", this.summary.blackMiddleAdvantageLost])
      if (this.summary.blackEndAdvantageLost > 0)
          this.blackAdvantageLostData.push(["End game", this.summary.blackEndAdvantageLost])

      this.pieceAnalysisData = []
      this.pieceAnalysisData.push(["Pawn", this.summary.pieceMisUndertood["p"]])
      this.pieceAnalysisData.push(["Rook", this.summary.pieceMisUndertood["r"]])
      this.pieceAnalysisData.push(["Knight", this.summary.pieceMisUndertood["n"]])
      this.pieceAnalysisData.push(["Bishop", this.summary.pieceMisUndertood["b"]])
      this.pieceAnalysisData.push(["Queen", this.summary.pieceMisUndertood["q"]])
      this.pieceAnalysisData.push(["King", this.summary.pieceMisUndertood["k"]])

      this.prepareFenMap(false)
      this.snackbar.open("Completed All games", "close");

      let gamesCount = this.selectedGames && this.selectedGames.length > 0 ? this.selectedGames.length : this.filteredGames.length;
      let filters = "";
      if (this.winner) {
          filters += this.winner
      }

      if (this.color) {
          if (filters.trim.length > 0) {
              filters += "-" + this.color
          } else {
              filters += this.color
          }

      }
      if (this.chessDotComMode) {
          this.analytics.recordChessDotComGamesAnalyzed(filters, gamesCount, this.depth)
      } else {
          this.analytics.recordMultipleGamesAnalyzed(filters, gamesCount, this.depth)
      }
      this.summary.fenMovesMap = this.fenMovesMap
      this.summary.practicePositions = this.practicePositions;
      this.summary.games = this.filteredGames
      setTimeout(() => {
        this.analysisCompleted = true;
      }, 1000);
      //Assign summary all values

      this.summary.pieceAnalysisData = this.pieceAnalysisData;
      this.summary.pieceAccuracyData = this.pieceAccuracyData;
      this.summary.top5LossesInOpening = this.top5LossesInOpening
      this.summary.openingAnalysisSummaryData = this.openingAnalysisSummaryData
      this.summary.middleGameAnalysisSummaryData = this.middleGameAnalysisSummaryData
      this.summary.endgameAnalysisSummaryData = this.endgameAnalysisSummaryData
      this.selectedView = 1
  }

  prepareTrainingData() {
    let now = new Date()
    let startedOn = now.getTime();
    let training: TrainingReport = {
      startedOn : now,
      puzzlesCompleted : 0,
      positionQuizesCompleted : 0,
      botsGames : 0,
      minBotsELOToPlayAgainst : 0,
      maxBotsELOToPlayAgainst : 0,
      gameInsightDone : false,
      gamesReviewCompleted : 0,
      maxPuzzleCount : environment.maxPuzzleCount,
      maxPositionQuizeToComplete : environment.maxPositionQuizeToComplete,
      botsGamesToBePlayed : environment.botsGamesToBePlayed,
      gamesReviewsToComplete : environment.gamesReviewsToComplete,
      currentAvgRating : 0,
      targetRating : 0,
      completed : false,
      completedPuzzles : [],
      completedPositions : [],
      saved : false
    }
    training.pieceAccuracies = {}
    this.summary.pieceAccuracyData.forEach(element => {
        switch (element[0]) {
            case "Knight":
                training.pieceAccuracies['n'] = element[1]
                break
            case "King":
                training.pieceAccuracies['k'] = element[1]
                break
            case "Bishop":
                training.pieceAccuracies['b'] = element[1]
                break
            case "Rook":
                training.pieceAccuracies['r'] = element[1]
                break
            case "Pawn":
                training.pieceAccuracies['p'] = element[1]
                break
            case "Queen":
                training.pieceAccuracies['q'] = element[1]
                break
        }
    });

    let avgELO = 0
    let count = 0;
    if(this.summary.games) {
      this.summary.games.forEach(game => {
        if (game.whitePlayer && game.whitePlayer.elo > 0) {
            avgELO += game.whitePlayer.elo;
            count++
        }
        if (game.blackPlayer && game.blackPlayer.elo > 0) {
            avgELO += game.blackPlayer.elo;
            count++
        }
      })
      avgELO = avgELO / count;
      training.minBotsELOToPlayAgainst = avgELO
      training.maxBotsELOToPlayAgainst = avgELO + 500
    }

    this.summary.top5LossesInOpening.forEach(opening => {
        let openingToStudy = {
            name: opening[0],
            playAs: opening[1]["playingAs"],
            eco: opening[1]["eco"]
        }
        if (!training.openingsToStudy) {
            training.openingsToStudy = []
        }
        training.openingsToStudy.push(openingToStudy)
    })
    training.misplayedPositions = this.summary.practicePositions
    training.gameInsightDone = true
    training.openingAnalysisSummaryData = this.summary.openingAnalysisSummaryData;
    training.middleGameAnalysisSummaryData = this.summary.middleGameAnalysisSummaryData;
    training.endgameAnalysisSummaryData = this.summary.endgameAnalysisSummaryData;
    training.whiteAdvantageLostData = this.whiteAdvantageLostData
    training.blackAdvantageLostData = this.blackAdvantageLostData;
    training.missedWeaknesses = this.summary.missedWeaknesses
    return training;
  }

  nextPosition() {
      this.currentPuzzleIndex++;
      if (this.practicePositions.length > this.currentPuzzleIndex) {
          this.currentPuzzle = this.practicePositions[this.currentPuzzleIndex];
      }
      this.analytics.recordAnalyzedPositionPlayed();
  }

  progressCallback(moveIndex, self) {
      if (self.currentGame && !self.stopRequested) {
          self.currentGame.progress = moveIndex
          self.changeDetecter.markForCheck()
      } else {

      }
  }

  matchUserName(name: string) {
      return name && name.toLocaleLowerCase() == this.username.toLocaleLowerCase()
  }

  completionCallback(moves, self) {
      if (self.stopRequested)
          return
      if (self.currentGame) {
          if (!self.summary) {
              self.summary = {
                  totalMistakes: 0,
                  totalBlunders: 0,
                  totalOpeningMistakes: 0,
                  totalMiddleGameMistakes: 0,
                  totalEndgameMistakes: 0,
                  totalOpeningBlunders: 0,
                  totalMiddleGameBlunders: 0,
                  totalEndgameBlunders: 0,
                  openingLosses: {},
                  missedWeakneeses : {}
              }
          }
          self.currentGame.moves = moves
          self.currentIndex++;
          self.currentGame.analyzingState = "completed"
          let whiteAnalysis: Analysis = {
              BRILLIANT: 0,
              GOOD_MOVE: 0,
              BEST: 0,
              BOOK_MOVE: 0,
              DUBIOUS: 0,
              MISTAKE: 0,
              BLUNDER: 0,
              MIDDLE_ADVANTAGE_LOST: 0,
              END_ADVANTAGE_LOST: 0
          }
          let blackAnalysis: Analysis = {
              BRILLIANT: 0,
              GOOD_MOVE: 0,
              BEST: 0,
              BOOK_MOVE: 0,
              DUBIOUS: 0,
              MISTAKE: 0,
              BLUNDER: 0,
              MIDDLE_ADVANTAGE_LOST: 0,
              END_ADVANTAGE_LOST: 0
          }
          if (self.currentGame.otherDetails["fen"])
              self.chess = new self.Chess(self.currentGame.otherDetails["fen"]);
          else
              self.chess = new self.Chess();
          let openingOver = false;
          let opening: EcoModel = null;
          let openingNotFound = true;
          let previousMove: ChessJS.Move = null;
          let lastMoveEval: string
          self.currentGame.pieceMisUndertood = {
              'p': 0,
              'r': 0,
              'n': 0,
              'b': 0,
              'q': 0,
              'k': 0
          }
          self.currentGame.knightAnalysis = {
              piece: "Knight",
              total: 0,
              mistakes: 0
          }

          self.currentGame.pawnAnalysis = {
              piece: "Pawn",
              total: 0,
              mistakes: 0
          }
          self.currentGame.rookAnalysis = {
              piece: "Rook",
              total: 0,
              mistakes: 0
          }
          self.currentGame.bishopAnalysis = {
              piece: "Bishop",
              total: 0,
              mistakes: 0
          }
          self.currentGame.queenAnalysis = {
              piece: "Queen",
              total: 0,
              mistakes: 0
          }
          self.currentGame.kingAnalysis = {
              piece: "King",
              total: 0,
              mistakes: 0
          }
          for (let index = 0; index < self.currentGame.moves.length; index++) {
              if (!self.currentGame.otherDetails["fen"]) {
                  let currentMove: ChessJS.Move = self.chess.move(self.currentGame.moves[index].move);
                  self.setMoveAnalysisByPiece(currentMove, self, false);
                  let fen = self.chess.fen()

                  if (self.ecos && self.ecos.length > 0 && !openingOver) {
                      openingNotFound = true
                      for (let eindex = 0; eindex < self.ecos.length; eindex++) {
                          let foundFen = self.ecos[eindex].fens.filter(f => f == fen)
                          if (foundFen.length > 0) {
                              self.currentGame.moves[index].moveCat = "BOOK_MOVE";
                              opening = self.ecos[eindex]
                              openingNotFound = false
                              break;
                          }
                      }
                  }

                  if (openingNotFound) {
                      openingOver = true
                  }

                  if (self.chess.turn() == 'w') {
                      if (self.matchUserName(self.currentGame.blackPlayer.name)) {
                          self.currentGame.moves[index].playedBySelectedUser = true
                      }
                      if (self.currentGame.moves[index].moveCat == "BRILLIANT" || self.currentGame.moves[index].moveCat == "0") {
                          whiteAnalysis.BRILLIANT++
                      }
                      if (self.currentGame.moves[index].moveCat == "GOOD_MOVE" || self.currentGame.moves[index].moveCat == "1") {
                          whiteAnalysis.GOOD_MOVE++
                      }
                      if (self.currentGame.moves[index].moveCat == "BEST" || self.currentGame.moves[index].moveCat == "2") {
                          whiteAnalysis.BEST++
                      }
                      if (self.currentGame.moves[index].moveCat == "DUBIOUS" || self.currentGame.moves[index].moveCat == "3") {
                          whiteAnalysis.DUBIOUS++
                      }
                      if (self.currentGame.moves[index].moveCat == "MISTAKE" || self.currentGame.moves[index].moveCat == "4") {
                          whiteAnalysis.MISTAKE++
                          if (self.matchUserName(self.currentGame.blackPlayer.name)) {
                              self.summary.totalMistakes++
                              if (findGamePhase(fen)) {
                                  self.summary.totalEndgameMistakes++
                              } else {
                                  if (index <= 20) {
                                      self.summary.totalOpeningMistakes++
                                  } else {
                                      self.summary.totalMiddleGameMistakes++
                                  }
                              }
                              if (self.currentGame.moves[index].bestMove && index > 20) {
                                  let engineEval: string = self.currentGame.moves[index].eval;
                                  if (engineEval.indexOf("M") < 0) {
                                      let engineEvalNum = Number.parseFloat(engineEval)
                                      if (engineEvalNum < 5) {
                                          let position: Puzzle = {
                                              puzzleId: '',
                                              fen: '',
                                              moves: [],
                                              rating: 0,
                                              deviation: 0,
                                              popularity: 0,
                                              nbPlayed: 0,
                                              theme: '',
                                              url: '',
                                              opening: ''
                                          }
                                          let cmove = self.chess.undo();
                                          let pmove = self.chess.undo();
                                          position.fen = self.chess.fen()
                                          position.moves.push(pmove.from + pmove.to)
                                          self.chess.move(pmove.san)
                                          let bMove = self.chess.move(self.currentGame.moves[index].bestMove)
                                          self.chess.undo();
                                          position.moves.push(bMove.from + bMove.to)
                                          self.chess.move(cmove.san)
                                          self.practicePositions.push(position)

                                      }
                                  }
                              }
                              if (previousMove) {
                                  if (self.currentGame.pieceMisUndertood[previousMove.piece]) {
                                      self.currentGame.pieceMisUndertood[previousMove.piece] = 1
                                  } else {
                                      self.currentGame.pieceMisUndertood[previousMove.piece]++
                                  }
                              }
                              self.setMoveAnalysisByPiece(currentMove, self, true);
                              //self.collectWeaknessData(self, fen, index)
                          }
                      }
                      if (self.currentGame.moves[index].moveCat == "BLUNDER" || self.currentGame.moves[index].moveCat == "5") {
                          whiteAnalysis.BLUNDER++
                          if (self.matchUserName(self.currentGame.blackPlayer.name)) {
                              self.summary.totalBlunders++
                              if (findGamePhase(fen)) {
                                  self.summary.totalEndgameBlunders++
                              } else {
                                  if (index <= 20) {
                                      self.summary.totalOpeningBlunders++
                                  } else {
                                      self.summary.totalMiddleGameBlunders++
                                  }
                              }
                              if (self.currentGame.moves[index].bestMove) {
                                  let position: Puzzle = {
                                      puzzleId: '',
                                      fen: '',
                                      moves: [],
                                      rating: 0,
                                      deviation: 0,
                                      popularity: 0,
                                      nbPlayed: 0,
                                      theme: '',
                                      url: '',
                                      opening: ''
                                  }
                                  let cmove = self.chess.undo();
                                  let pmove = self.chess.undo();
                                  position.fen = self.chess.fen()
                                  position.moves.push(pmove.from + pmove.to)
                                  self.chess.move(pmove.san)
                                  let bMove = self.chess.move(self.currentGame.moves[index].bestMove)
                                  self.chess.undo();
                                  position.moves.push(bMove.from + bMove.to)
                                  self.chess.move(cmove.san)
                                  self.practicePositions.push(position)
                              }
                              if (lastMoveEval && lastMoveEval.indexOf("M") < 0) {
                                  let currentEval: string = self.currentGame.moves[index].eval;
                                  if (currentEval.indexOf("M") < 0) {
                                      let currentEvalNum = Number.parseFloat(currentEval);
                                      let lastEvalNum = Number.parseFloat(lastMoveEval);
                                      if (lastEvalNum < 0 && lastEvalNum < currentEvalNum) {
                                          if (findGamePhase(fen))
                                              whiteAnalysis.END_ADVANTAGE_LOST++
                                          else
                                              whiteAnalysis.MIDDLE_ADVANTAGE_LOST++
                                      }
                                  }
                              }
                          }
                          if (previousMove) {
                              if (self.currentGame.pieceMisUndertood[previousMove.piece]) {
                                  self.currentGame.pieceMisUndertood[previousMove.piece] = 1
                              } else {
                                  self.currentGame.pieceMisUndertood[previousMove.piece]++
                              }
                          }
                          self.setMoveAnalysisByPiece(currentMove, self, true);
                          //self.collectWeaknessData(self, fen, index)
                      }
                      if (self.currentGame.moves[index].moveCat == "BOOK_MOVE" || self.currentGame.moves[index].moveCat == "6") {
                          whiteAnalysis.BOOK_MOVE++
                      }
                  } else {
                      if (self.matchUserName(self.currentGame.whitePlayer.name)) {
                          self.currentGame.moves[index].playedBySelectedUser = true
                      }
                      if (self.currentGame.moves[index].moveCat == "BRILLIANT" || self.currentGame.moves[index].moveCat == "0") {
                          blackAnalysis.BRILLIANT++
                      }
                      if (self.currentGame.moves[index].moveCat == "GOOD_MOVE" || self.currentGame.moves[index].moveCat == "1") {
                          blackAnalysis.GOOD_MOVE++
                      }
                      if (self.currentGame.moves[index].moveCat == "BEST" || self.currentGame.moves[index].moveCat == "2") {
                          blackAnalysis.BEST++
                      }
                      if (self.currentGame.moves[index].moveCat == "DUBIOUS" || self.currentGame.moves[index].moveCat == "3") {
                          blackAnalysis.DUBIOUS++
                      }
                      if (self.currentGame.moves[index].moveCat == "MISTAKE" || self.currentGame.moves[index].moveCat == "4") {
                          blackAnalysis.MISTAKE++
                          if (self.matchUserName(self.currentGame.whitePlayer.name)) {
                              self.summary.totalMistakes++
                              if (findGamePhase(fen)) {
                                  self.summary.totalEndgameMistakes++
                              } else {
                                  if (index <= 20) {
                                      self.summary.totalOpeningMistakes++
                                  } else {
                                      self.summary.totalMiddleGameMistakes++
                                  }
                              }
                              if (self.currentGame.moves[index].bestMove && index > 20) {
                                  let engineEval: string = self.currentGame.moves[index].eval;
                                  if (engineEval.indexOf("M") < 0) {
                                      let engineEvalNum = Number.parseFloat(engineEval)
                                      if (engineEvalNum < 5) {
                                          let position: Puzzle = {
                                              puzzleId: '',
                                              fen: '',
                                              moves: [],
                                              rating: 0,
                                              deviation: 0,
                                              popularity: 0,
                                              nbPlayed: 0,
                                              theme: '',
                                              url: '',
                                              opening: ''
                                          }
                                          let cmove = self.chess.undo();
                                          let pmove = self.chess.undo();
                                          position.fen = self.chess.fen()
                                          position.moves.push(pmove.from + pmove.to)
                                          self.chess.move(pmove.san)
                                          let bMove = self.chess.move(self.currentGame.moves[index].bestMove)
                                          self.chess.undo();
                                          position.moves.push(bMove.from + bMove.to)
                                          self.chess.move(cmove.san)
                                          self.practicePositions.push(position)
                                      }
                                  }
                              }
                              if (previousMove) {
                                  if (self.currentGame.pieceMisUndertood[previousMove.piece]) {
                                      self.currentGame.pieceMisUndertood[previousMove.piece] = 1
                                  } else {
                                      self.currentGame.pieceMisUndertood[previousMove.piece]++
                                  }
                              }
                              self.setMoveAnalysisByPiece(currentMove, self, true);
                          }
                      }
                      if (self.currentGame.moves[index].moveCat == "BLUNDER" || self.currentGame.moves[index].moveCat == "5") {
                          blackAnalysis.BLUNDER++
                          if (self.matchUserName(self.currentGame.whitePlayer.name)) {
                              self.summary.totalBlunders++
                              if (findGamePhase(fen)) {
                                  self.summary.totalEndgameBlunders++
                              } else {
                                  if (index <= 20) {
                                      self.summary.totalOpeningBlunders++
                                  } else {
                                      self.summary.totalMiddleGameBlunders++
                                  }
                              }
                              if (self.currentGame.moves[index].bestMove) {
                                  let position: Puzzle = {
                                      puzzleId: '',
                                      fen: '',
                                      moves: [],
                                      rating: 0,
                                      deviation: 0,
                                      popularity: 0,
                                      nbPlayed: 0,
                                      theme: '',
                                      url: '',
                                      opening: ''
                                  }
                                  let cmove = self.chess.undo();
                                  let pmove = self.chess.undo();
                                  position.fen = self.chess.fen()
                                  position.moves.push(pmove.from + pmove.to)
                                  self.chess.move(pmove.san)
                                  let bMove = self.chess.move(self.currentGame.moves[index].bestMove)
                                  self.chess.undo();
                                  position.moves.push(bMove.from + bMove.to)
                                  self.chess.move(cmove.san)
                                  self.practicePositions.push(position)
                              }
                              if (lastMoveEval && lastMoveEval.indexOf("M") < 0) {
                                  let currentEval: string = self.currentGame.moves[index].eval;
                                  if (currentEval.indexOf("M") < 0) {
                                      let currentEvalNum = Number.parseFloat(currentEval);
                                      let lastEvalNum = Number.parseFloat(lastMoveEval);
                                      if (lastEvalNum > 0 && lastEvalNum > currentEvalNum) {
                                          if (findGamePhase(fen))
                                              blackAnalysis.END_ADVANTAGE_LOST++
                                          else
                                              blackAnalysis.MIDDLE_ADVANTAGE_LOST++
                                      }
                                  }
                              }
                              if (previousMove) {
                                  if (self.currentGame.pieceMisUndertood[previousMove.piece]) {
                                      self.currentGame.pieceMisUndertood[previousMove.piece] = 1
                                  } else {
                                      self.currentGame.pieceMisUndertood[previousMove.piece]++
                                  }
                              }
                              self.setMoveAnalysisByPiece(currentMove, self, true);
                          }
                      }
                      if (self.currentGame.moves[index].moveCat == "BOOK_MOVE" || self.currentGame.moves[index].moveCat == "6") {
                          blackAnalysis.BOOK_MOVE++
                      }
                  }
                  previousMove = currentMove;
                  lastMoveEval = self.currentGame.moves[index].eval
              }
          }
          if (opening && opening.name.trim().length > 0) {
              if (self.matchUserName(self.currentGame.whitePlayer.name) && self.currentGame.result == "0-1") {
                  if (self.summary.openingLosses[opening.name]) {
                      self.summary.openingLosses[opening.name].count++
                  } else {
                      self.summary.openingLosses[opening.name] = {
                          name: opening.name,
                          playingAs: 'white',
                          count: 1,
                          eco: opening.eco
                      }
                  }
              }
              if (self.matchUserName(self.currentGame.blackPlayer.name) && self.currentGame.result == "1-0") {
                  if (self.summary.openingLosses[opening.name]) {
                      self.summary.openingLosses[opening.name].count++
                  } else {
                      self.summary.openingLosses[opening.name] = {
                          name: opening.name,
                          playingAs: 'black',
                          count: 1,
                          eco: opening.eco
                      }
                  }
              }
          }

          self.currentGame.blackAnalysis = blackAnalysis;
          self.currentGame.whiteAnalysis = whiteAnalysis;
          let gameDate = "";
          if (self.currentGame.date) {
              gameDate = self.currentGame.date;
          } else {
              gameDate = "01-" + self.month + "-" + self.year
          }
          let analysisObject: GameStorageSchema = {
              white: self.currentGame.whitePlayer.name,
              black: self.currentGame.blackPlayer.name,
              pgn: self.currentGame.pgn,
              eco: self.currentGame.eco,
              date: gameDate,
              result: self.currentGame.result,
              moveCount: self.currentGame.moves.length
          }
          self.storageService.addGame(analysisObject).subscribe(res => {
              self.currentGame.gameId = res.id;
          })
          if (!self.summary.pieceMisUndertood) {
              self.summary.pieceMisUndertood = self.currentGame.pieceMisUndertood
          } else {
              self.summary.pieceMisUndertood['p'] += self.currentGame.pieceMisUndertood['p']
              self.summary.pieceMisUndertood['r'] += self.currentGame.pieceMisUndertood['r']
              self.summary.pieceMisUndertood['n'] += self.currentGame.pieceMisUndertood['n']
              self.summary.pieceMisUndertood['b'] += self.currentGame.pieceMisUndertood['b']
              self.summary.pieceMisUndertood['q'] += self.currentGame.pieceMisUndertood['q']
              self.summary.pieceMisUndertood['k'] += self.currentGame.pieceMisUndertood['k']
          }
          if (!self.summary.pawnAnalysis) {
              self.summary.pawnAnalysis = self.currentGame.pawnAnalysis
          } else {
              self.summary.pawnAnalysis.total += self.currentGame.pawnAnalysis.total
              self.summary.pawnAnalysis.mistakes += self.currentGame.pawnAnalysis.mistakes
          }
          if (!self.summary.rookAnalysis) {
              self.summary.rookAnalysis = self.currentGame.rookAnalysis
          } else {
              self.summary.rookAnalysis.total += self.currentGame.rookAnalysis.total
              self.summary.rookAnalysis.mistakes += self.currentGame.rookAnalysis.mistakes
          }
          if (!self.summary.bishopAnalysis) {
              self.summary.bishopAnalysis = self.currentGame.bishopAnalysis
          } else {
              self.summary.bishopAnalysis.total += self.currentGame.bishopAnalysis.total
              self.summary.bishopAnalysis.mistakes += self.currentGame.bishopAnalysis.mistakes
          }
          if (!self.summary.knightAnalysis) {
              self.summary.knightAnalysis = self.currentGame.knightAnalysis
          } else {
              self.summary.knightAnalysis.total += self.currentGame.knightAnalysis.total
              self.summary.knightAnalysis.mistakes += self.currentGame.knightAnalysis.mistakes
          }
          if (!self.summary.queenAnalysis) {
              self.summary.queenAnalysis = self.currentGame.queenAnalysis
          } else {
              self.summary.queenAnalysis.total += self.currentGame.queenAnalysis.total
              self.summary.queenAnalysis.mistakes += self.currentGame.queenAnalysis.mistakes
          }
          if (!self.summary.kingAnalysis) {
              self.summary.kingAnalysis = self.currentGame.kingAnalysis
          } else {
              self.summary.kingAnalysis.total += self.currentGame.kingAnalysis.total
              self.summary.kingAnalysis.mistakes += self.currentGame.kingAnalysis.mistakes
          }
          if (!self.summary.whiteMiddleAdvantageLost) {
              self.summary.whiteMiddleAdvantageLost = 0;
          }
          if (!self.summary.whiteEndAdvantageLost) {
              self.summary.whiteEndAdvantageLost = 0;
          }
          if (!self.summary.blackMiddleAdvantageLost) {
              self.summary.blackMiddleAdvantageLost = 0;
          }
          if (!self.summary.blackEndAdvantageLost) {
              self.summary.blackEndAdvantageLost = 0;
          }
          self.summary.whiteMiddleAdvantageLost += self.currentGame.blackAnalysis.MIDDLE_ADVANTAGE_LOST
          self.summary.whiteEndAdvantageLost += self.currentGame.blackAnalysis.END_ADVANTAGE_LOST
          self.summary.blackMiddleAdvantageLost += self.currentGame.whiteAnalysis.MIDDLE_ADVANTAGE_LOST
          self.summary.blackEndAdvantageLost += self.currentGame.whiteAnalysis.END_ADVANTAGE_LOST
          let totalGameCount = self.selectedGames && self.selectedGames.length > 0 ? self.selectedGames.length : self.filteredGames.length;
          self.globalProgress = (self.currentIndex / totalGameCount) * 100;
          self.analyzeGames()
      }
  }

  collectWeaknessData(self, fen, index) {
    let chessTmp = new ChessJS.Chess(fen)
    chessTmp.move(self.currentGame.moves[index].bestMove)
    let bestFen = chessTmp.fen();
    chessTmp.undo()
    chessTmp.move(self.currentGame.moves[index].move);
    let playedFen = chessTmp.fen();
    let bestAnalysis = analyzeWeakness(bestFen)
    let playedAnalysis = analyzeWeakness(playedFen)
    let bWeaknesses = []
    let wWeaknesses = []
    if(playedAnalysis['b'] && bestAnalysis['b']) {
      bWeaknesses = bestAnalysis['b'].filter(x=> !playedAnalysis['b'].includes(x))
    }
    if(playedAnalysis['w'] && bestAnalysis['w']) {
      wWeaknesses = bestAnalysis['w'].filter(x=> !playedAnalysis['w'].includes(x))
    }

    if(self.matchUserName(self.currentGame.blackPlayer.name))
    {
      //selected player is playing with black
      if(!self.currentGame.moves[index].missedWeaknesses) {
        self.currentGame.moves[index].missedWeaknesses = []
      }
      if(wWeaknesses && wWeaknesses[0] && wWeaknesses[0].length > 0) {
        wWeaknesses[0].forEach(w=> {
          self.currentGame.moves[index].missedWeaknesses.push(w)
        })
      }

      self.currentGame.moves[index].bothSideAnalysis = playedAnalysis
    } else {
      //selected player is playing with white
      if(!self.currentGame.moves[index].missedWeaknesses) {
        self.currentGame.moves[index].missedWeaknesses = []
      }
      if(bWeaknesses && bWeaknesses[0] && bWeaknesses[0].length > 0) {
        bWeaknesses[0].forEach(w=> {
          self.currentGame.moves[index].missedWeaknesses.push(w)
        })
      }

      self.currentGame.moves[index].bothSideAnalysis = playedAnalysis
    }
    if(self.currentGame.moves[index].missedWeaknesses && self.currentGame.moves[index].missedWeaknesses.length > 0) {
      self.currentGame.moves[index].missedWeaknesses.forEach(weakness=> {
        if(!self.summary.missedWeakneeses[weakness.weakness]) {
          self.summary.missedWeakneeses[weakness.weakness] = 0
        }
        self.summary.missedWeakneeses[weakness.weakness]++
      })
    }
  }

  prepareAnalyticalData(moves: Move[], self: BulkAnalyzerComponent) {
      let chess = new this.Chess();
      if (moves && moves.length > 0) {
          for (let index = 0; index < moves.length; index++) {
              if (index < 5)
                  continue
              let move = moves[index];
              let fenBeforeMove = chess.fen();
              chess.move(move.move);
              let fenAfterMove = chess.fen();
              chess.undo();
              let materialBeforeMove = getMaterialDifference(fenBeforeMove)
              let materialAfterMove = getMaterialDifference(fenAfterMove)
              if (move.candidateLines && move.candidateLines.lines.length > 0) {
                  let primaryLineChecker = new this.Chess(fenBeforeMove);
                  move.candidateLines.lines[0].moves.forEach(m => {
                      primaryLineChecker.move(m)
                  })
                  let fenAfterCandidateLines = primaryLineChecker.fen()
                  let materialAfterCandidateLines = getMaterialDifference(fenAfterCandidateLines)
                  if (self.matchUserName(self.currentGame.whitePlayer.name)) {
                      if (moves[index - 1].eval.indexOf("M") > -1 || move.eval.indexOf("M") > -1) {
                          continue;
                      }
                      if (materialBeforeMove.white < materialAfterMove.white && moves[index - 1].eval > move.eval && materialAfterCandidateLines.white > materialAfterMove.white) {
                          move.analyticalStatement = {
                              dialoge: "You lost material and position also became worse",
                              moveSequence: move.candidateLines.lines[0].moves
                          }
                      } else {
                          if (moves[index - 1].eval > move.eval && materialAfterCandidateLines.black < materialAfterMove.black) {
                              move.analyticalStatement = {
                                  dialoge: "You missed chance of winning material",
                                  moveSequence: move.candidateLines.lines[0].moves
                              }
                          } else {
                              if (materialBeforeMove.black > materialAfterMove.black && Math.abs(Number.parseFloat(moves[index - 1].eval) - Number.parseFloat(move.eval)) < 0.6) {
                                  move.analyticalStatement = {
                                      dialoge: "You found the best move",
                                      moveSequence: move.candidateLines.lines[0].moves
                                  }
                              }
                          }
                      }
                  } else {
                      if (materialBeforeMove.black < materialAfterMove.black && moves[index - 1].eval > move.eval && materialAfterCandidateLines.black > materialAfterMove.black) {
                          move.analyticalStatement = {
                              dialoge: "You lost material and position also became worse",
                              moveSequence: move.candidateLines.lines[0].moves
                          }
                      } else {
                          if (moves[index - 1].eval > move.eval && materialAfterCandidateLines.white < materialAfterMove.white) {
                              move.analyticalStatement = {
                                  dialoge: "You missed chance of winning material",
                                  moveSequence: move.candidateLines.lines[0].moves
                              }
                          } else {
                              if (materialBeforeMove.white > materialAfterMove.white && Math.abs(Number.parseFloat(moves[index - 1].eval) - Number.parseFloat(move.eval)) < 0.6) {
                                  move.analyticalStatement = {
                                      dialoge: "You found the best move",
                                      moveSequence: move.candidateLines.lines[0].moves
                                  }
                              }
                          }
                      }
                  }
              }
          }
      }
    }

      private setMoveAnalysisByPiece(currentMove: ChessJS.Move, self: any, isMistake) {
          if (currentMove.piece == 'p') {
              if (!self.currentGame.pawnAnalysis) {
                  self.currentGame.pawnAnalysis = {
                      piece: "Pawn",
                      total: 0,
                      mistakes: 0
                  };
              }
              if (!isMistake)
                  self.currentGame.pawnAnalysis.total++;
              else
                  self.currentGame.pawnAnalysis.mistakes++;

          }
          if (currentMove.piece == 'r') {
              if (!self.currentGame.rookAnalysis) {
                  self.currentGame.rookAnalysis = {
                      piece: "Rook",
                      total: 0,
                      mistakes: 0
                  };
              }
              if (!isMistake)
                  self.currentGame.rookAnalysis.total++;
              else
                  self.currentGame.rookAnalysis.mistakes++;

          }
          if (currentMove.piece == 'n') {
              if (!self.currentGame.knightAnalysis) {
                  self.currentGame.knightAnalysis = {
                      piece: "Knight",
                      total: 0,
                      mistakes: 0
                  };
              }
              if (!isMistake)
                  self.currentGame.knightAnalysis.total++;
              else
                  self.currentGame.knightAnalysis.mistakes++;

          }
          if (currentMove.piece == 'b') {
              if (!self.currentGame.bishopAnalysis) {
                  self.currentGame.bishopAnalysis = {
                      piece: "Bishop",
                      total: 0,
                      mistakes: 0
                  };
              }
              if (!isMistake)
                  self.currentGame.bishopAnalysis.total++;
              else
                  self.currentGame.bishopAnalysis.mistakes++;

          }
          if (currentMove.piece == 'q') {
              if (!self.currentGame.queenAnalysis) {
                  self.currentGame.queenAnalysis = {
                      piece: "Queen",
                      total: 0,
                      mistakes: 0
                  };
              }
              if (!isMistake)
                  self.currentGame.queenAnalysis.total++;
              else
                  self.currentGame.queenAnalysis.mistakes++;

          }
          if (currentMove.piece == 'k') {
              if (!self.currentGame.kingAnalysis) {
                  self.currentGame.kingAnalysis = {
                      piece: "King",
                      total: 0,
                      mistakes: 0
                  };
              }
              if (!isMistake)
                  self.currentGame.kingAnalysis.total++;
              else
                  self.currentGame.kingAnalysis.mistakes++;

          }

      }

      getMoves(game: Game) {
          let str = "";
          if (game && game.moves) {
              game.moves.forEach(m => {
                  str += m.move + " ";
              })
          }
          return str.trim();
      }

      seeMore(game) {
          if (this.expandedGame && this.expandedGame.md5 == game.md5) {
              this.expandedGame = null;
          } else {
              this.expandedGame = game;
          }
          this.analytics.recordIndividualGameAnalysisVisited()
      }

      selectGame(event, game) {
          let foundGame = this.selectedGames.filter(g => g.md5 == game.md5)
          if (event.checked) {
              if (foundGame.length == 0) {
                  this.selectedGames.push(game)
              }
          } else {
              if (foundGame.length > 0) {
                  this.selectedGames = this.selectedGames.filter(g => g.md5 != game.md5)
              }
          }
      }

      sortObjectByValue(openingLoss) {
          let sortedArray = []
          for (let key in openingLoss) {
              sortedArray.push([key, openingLoss[key]])
          }
          return sortedArray.sort(function(a, b) {
              return b[1].count - a[1].count;
          });
      }

      openInEngine(game: Game) {
          this.clipboard.copy(game.pgn)
          this.router.navigate(["/free-chess-engine"])
      }

      getAnalyzedGames(game: Game) {
          let md5Str = this.getMoves(game)
          this.storageService.getAllAnalysis().subscribe(result => {
              result.forEach(r => {
                  if (r.md5 == md5Str) {
                      game.moves = r.moves;
                      game.analyzingState = 'completed'
                  }
              })
          })
      }

      selectFiles(event) {
          this.uploadedFiles = event.target.files;
          this.uploadedPgns = []
          let readers: FileReader[] = []
          for (let i = 0; i < this.uploadedFiles.length; i++) {
              readers.push(new FileReader());
              //pgns.push(this.fileREader.readAsText(files[i]));
          }
          for (let i = 0; i < this.uploadedFiles.length; i++) {
              readers[i].onload = (e) => {
                  this.uploadedPgns.push(readers[i].result)
              }
              readers[i].readAsText(this.uploadedFiles[i])
          }
      }

      uploadAllFiles() {
          let pgnStr = "";
          this.uploadedPgns.forEach(pgn => {
              pgnStr += pgn;
              pgnStr += "\n\n";
          })
          this.downloadingGames = true;
          this.service.parseBulkPgn(pgnStr).subscribe(res => {
              this.games = res.body;
              this.blankRequestMode = false;
              this.filteredGames = res.body;
              this.downloadingGames = false;
          }, error => {
              this.snackbar.open("There was some problem and we will look into it", "close")
              this.downloadingGames = false;
          })
      }

      setUserName(playerNameTextBox: HTMLInputElement) {
          this.username = playerNameTextBox.value.trim();
          this.filteredGames = this.filteredGames.filter(g => this.matchUserName(g.whitePlayer.name) || this.matchUserName(g.blackPlayer.name))
          this.prepareFenMap()
      }

      prepareFenMap(saveGames = true) {
          let analyzedGames = this.selectedGames && this.selectedGames.length > 0 ? this.selectedGames : this.filteredGames
          this.fenMovesMap = {}
          analyzedGames.forEach(game => {
              if (this.matchUserName(game.whitePlayer.name) && this.matchUserName(game.blackPlayer.name))
                  return
              this.chess.reset();

              game.moves.forEach(move => {
                  let fen = this.chess.fen();
                  let moveDetail = {
                      move: move.move,
                      whiteWins: 0,
                      blackWins: 0,
                      draws: 0,
                      count: 1,
                      games: [],
                      eval: move.eval,
                      bestMove: move.bestMove,
                      playedBySelectedUser: move.playedBySelectedUser
                  }
                  if(saveGames)
                    moveDetail.games.push(game)
                  if (game.result == "1-0") {
                      moveDetail.whiteWins = 1
                  } else {
                      if (game.result == "0-1") {
                          moveDetail.blackWins = 1
                      } else {
                          moveDetail.draws = 1
                      }
                  }
                  if (this.fenMovesMap[fen]) {
                      let matched = false;
                      if (!this.fenMovesMap[fen].moves) {
                          this.fenMovesMap[fen].moves = []
                      }
                      for (let m of this.fenMovesMap[fen].moves) {
                          if (m.move == move.move) {
                              m.whiteWins = m.whiteWins + moveDetail.whiteWins
                              m.blackWins = m.blackWins + moveDetail.blackWins
                              m.draws = m.draws + moveDetail.draws
                              m.count = m.whiteWins + m.blackWins + m.draws
                              if(saveGames) {
                                if (!m.games) {
                                  m.games = []
                                }
                                m.games.push(game)
                              }

                              matched = true;
                              break;
                          }
                      }
                      if (!matched) {
                          this.fenMovesMap[fen].moves.push(moveDetail);
                      }
                  } else {
                      this.fenMovesMap[fen] = {
                          moves: []
                      }
                      this.fenMovesMap[fen].moves.push(moveDetail);
                  }
                  this.chess.move(move.move)
              })
          })
          this.chess.reset();
          this.currentFen = this.chess.fen();
          this.currentMoves = this.fenMovesMap[this.currentFen].moves
          this.currentMoveIndex = 1;
          this.currentMoves.sort(function(a: MoveDetails, b: MoveDetails) {
              return b.count - a.count;
          })
          this.playedFens = []
          this.playedFens.push(this.initialPosition)
          this.currentScore = this.fenMovesMap[this.currentFen].eval
      }

      fonMoveSelect(move: string, board: ChessBoardComponent) {
          board.makeMove(move);
          let fen = board.getFen();
          this.currentFen = fen;
          let moveDetails = {
              fen: fen,
              move: move
          }
          this.fonMoveEx(moveDetails)
      }

      fundo(board: ChessBoardComponent) {
          if (this.playedFens.length > 1) {
              this.playedFens.pop()
              this.playedMoves.pop()
              board.undoMove();
              this.chess.undo();
              this.currentFen = this.playedFens[this.playedFens.length - 1];
              this.currentMoves = this.fenMovesMap[this.currentFen].moves;
              this.currentMoves.forEach(m => {
                  this.filteredGames.push(...m.games);
              })
              this.currentMoveIndex--;
          }
      }
      fonMoveEx(moveDetails: any) {
          if (this.fenMovesMap[moveDetails.fen]) {
              this.filteredGames = [];
              this.gamesFromLine = []
              this.currentFen = moveDetails.fen;
              this.currentMoves = this.fenMovesMap[this.currentFen].moves;
              this.currentMoveIndex++;
              this.currentMoves.sort(function(a: MoveDetails, b: MoveDetails) {
                  return b.count - a.count;
              })
              this.currentMoves.forEach(m => {
                  this.filteredGames.push(...m.games);
              })
              this.gamesFromLine = this.filteredGames;
              this.playedFens.push(this.currentFen)
              this.fenMovesMap[this.playedFens[this.playedFens.length - 2]].moves.forEach(m => {
                  if (m.move == moveDetails.move) {
                      this.currentScore = m.eval;
                  }
              })
              this.playedMoves.push(moveDetails.move)
          } else {
              this.noMoveAvailable = true;
          }
          this.analytics.recordMultiGameAnalysisGameExplorerUsed(this.currentMoveIndex)
      }

      onMoveSelect(move: string, board: ChessBoardComponent) {
          board.makeMove(move);
          let fen = board.getFen();
          this.currentFen = fen;
          let moveDetails = {
              fen: fen,
              move: move
          }
          this.onMoveEx(moveDetails)
      }

      undo(board: ChessBoardComponent) {
          removeAllSquareConnectingArrow(this.boardid)
          if (this.playedFens.length > 1) {
              this.playedFens.pop()
              this.playedMoves.pop()
              board.undoMove();
              this.chess.undo();
              this.currentFen = this.playedFens[this.playedFens.length - 1];
              this.currentMoves = this.fenMovesMap[this.currentFen].moves;
              this.currentMoveIndex--;
          }
      }
      onMoveEx(moveDetails: any) {
          removeAllSquareConnectingArrow(this.boardid)
          if (this.fenMovesMap[moveDetails.fen]) {
              this.currentFen = moveDetails.fen;
              this.currentMoves = this.fenMovesMap[this.currentFen].moves;
              this.currentMoveIndex++;
              this.currentMoves.sort(function(a: MoveDetails, b: MoveDetails) {
                  return b.count - a.count;
              })
              this.playedFens.push(this.currentFen)
              this.fenMovesMap[this.playedFens[this.playedFens.length - 2]].moves.forEach(m => {
                  if (m.move == moveDetails.move) {
                      this.currentScore = m.eval;
                  }
              })
              this.playedMoves.push(moveDetails.move)

              this.currentMoves.forEach(move => {
                  if (move.playedBySelectedUser) {
                      this.chess = new this.Chess(moveDetails.fen);
                      let chessMove = this.chess.move(move.move);
                      drawArrowBetweenSquare(chessMove.from, chessMove.to, this.boardid, "#1111ee")
                  }
              })
              if (this.currentMoves[0].bestMove) {
                  this.chess = new this.Chess(moveDetails.fen);
                  let chessMove = this.chess.move(this.currentMoves[0].bestMove);
                  drawArrowBetweenSquare(chessMove.from, chessMove.to, this.boardid, "#11ee11")
              }

          } else {
              this.noMoveAvailable = true;
          }
          this.analytics.recordMultiGameAnalysisGameExplorerUsed(this.currentMoveIndex)

      }

      stopAnalysis() {
          this.stopRequested = true;
          this.showAnalysisCompleted();
          this.analyzer.stopAnalysis();
      }

      filterRapidOrLonger(checked) {
          let onlyRapidOrLongerGames = []
          let allGames = this.filteredGames && this.filteredGames.length > 0 ? this.filteredGames : this.games;
          allGames.forEach(game => {
              if (game.otherDetails["TimeControl"]) {
                  let timeInSec = Number.parseInt(game.otherDetails["TimeControl"]);
                  if (timeInSec >= this.minRapidTimeInSec) {
                      onlyRapidOrLongerGames.push(game);
                  }
              }
          })
          this.filteredGames = onlyRapidOrLongerGames;
      }

      fetchChessComGameMetadata() {
        if(this.username && this.username.trim().length > 0) {
          let archiveLink = "https://api.chess.com/pub/player/"+this.username+"/games/";
          this.downloadStarted = true;
          this.service.fetchChessComGamesMetaData(this.username).subscribe(res=> {
            if(res && res.body) {
              this.error = null;
              this.metadata = res.body.archives;
              this.metadata.forEach((m : string)=> {
                let url = m.toLocaleLowerCase().replace(archiveLink.toLocaleLowerCase(), "")
                let dt = url.split("/");
                let date = getMonth(dt[1]) + "-" + dt[0];
                this.metadataMonths.push({
                  date : date,
                  link : m
                })
              })

              this.metadataMonths = this.metadataMonths.sort((a,b)=>{
                let aDateObj = new Date(Date.parse(a.date));
                let bDateObj = new Date(Date.parse(b.date));
                return (bDateObj.getFullYear() * 365 + (bDateObj.getMonth() + 1) * 30) - (aDateObj.getFullYear() * 365 + (aDateObj.getMonth() + 1) * 30)
              })
            }
            this.downloadStarted = false;
          },e=> {
            this.metadata = []
            this.metadataMonths = []
            this.error = "Failed to fetch games for " + this.username
            this.downloadStarted = false;
          })
        }
      }

      fetchChessComGames(date) {
        let dateObj = new Date(Date.parse(date));
        let month = dateObj.getMonth() +1;
        let year = dateObj.getFullYear();
        this.chessDotComGamesSelected = true;
        this.router.navigate(["/tools/multiple-chess-games-analyzer"],{queryParams: {"year":year, "month" : month,"ref" : "chess.com", "username" : this.username}})
      }

      fetchLichessGames() {
        let formats = "";
        if(this.lichessBlitzSelected)
          formats = "blitz"
        if(this.lichessRapidSelected)
          formats += ",rapid"
        if(this.lichessClassicalSelected)
          formats += ",classical"
        if(formats.startsWith(",")) {
          formats = formats.substring(1);
        }
        this.username = this.lichessUsername
        this.downloadingGames = true;
        this.service.downloadLichessGames(this.lichessUsername, formats).subscribe(res=> {
          if (res) {
            this.games = res.body;
            this.filteredGames = res.body;
            this.prepareFenMap()
            this.downloadingGames = false;
        }
        }, error => {
            this.snackbar.open("There was some problem and we will look into it", "close")
            this.downloadingGames = false;
        })
      }

      saveAnalysis() {
        let userStr = localStorage.getItem("auth.user")
        if(userStr) {
          let user = JSON.parse(userStr)
          const dialogRef = this.dialog.open(SummaryDialog)
          dialogRef.afterClosed().subscribe(data=> {
            this.summary.insightName = data.name
            this.summary.comment = data.comment
            this.summary.createdOn = new Date();
            this.savingAnalysis = true;
            this.service.saveGameInsight(this.summary, user.id).subscribe(res=> {
              this.savingAnalysis = false;
              if(res.status == 200) {
                this.snackbar.open("Game insight is saved", "close")
              }
              this.summary.id = res.body.id;
            }, err=> {
              this.savingAnalysis = false;
              this.snackbar.open("There was a problem in saving Game insight. Please try later", "close")
            })
          })

        } else {
          const dialogRef = this.dialog.open(WarningDialogue)
          dialogRef.afterClosed().subscribe(data=> {

            if(data == "continue") {
            } else {
              if(data == "sign in") {
                const reportUrl = this.router.createUrlTree(['/sign-in']).toString();
                window.open(reportUrl, '_blank');
              }
            }
          })
        }

      }

      loadInsight(id) {
        this.loadingInsight = true
        this.selectedView = 1;
        this.service.fetchGameInsight(id).subscribe(res=> {
          this.summary = res.body;
          this.analysisCompleted = true;
          this.loadingInsight = false;
          //this.games = this.summary.games;
          this.fenMovesMap = this.summary.fenMovesMap
          this.chess.reset();
          this.currentFen = this.chess.fen();
          this.currentMoves = this.fenMovesMap[this.currentFen].moves
          this.currentMoveIndex = 1;
          this.whiteAdvantageLostData = []
          this.blackAdvantageLostData = []
          this.practicePositions = this.summary.practicePositions;
          if (this.summary.whiteMiddleAdvantageLost > 0)
              this.whiteAdvantageLostData.push(["Middle Game", this.summary.whiteMiddleAdvantageLost])
          if (this.summary.whiteEndAdvantageLost > 0)
              this.whiteAdvantageLostData.push(["End game", this.summary.whiteEndAdvantageLost])
          if (this.summary.blackMiddleAdvantageLost > 0)
              this.blackAdvantageLostData.push(["Middle Game", this.summary.blackMiddleAdvantageLost])
          if (this.summary.blackEndAdvantageLost > 0)
              this.blackAdvantageLostData.push(["End game", this.summary.blackEndAdvantageLost])
          this.currentPuzzle = this.summary.practicePositions[0]
        },err=> {
          this.snackbar.open("There was some problem in loading insight, Please try again", "close")
        })
      }

      generateTraining(){
        let training = null;
        if(this.trainingGenerated) {
          this.snackbar.open("Training has been generated already", "close")
          return;
        }
        let reportStr = localStorage.getItem("trainingReport")
        if(reportStr) {
          let report : TrainingReport = JSON.parse(reportStr)
          if(!report.completed) {
            if(report.id) {
              let dialogRef = this.dialog.open(AlertDialogeComponent, {
                data : {
                  "message" : "You already have an active training going on. Either complete or delete that one first.",
                  "option1Str" : "Ok",
                  "option2Str" : null,
                }
              })
              return;
            }
            let dialogRef = this.dialog.open(AlertDialogeComponent, {
              data : {
                "message" : "You have an active training, Do you want to create new one?",
                "option1Str" : "No",
                "option2Str" : "Yes",
              }
            })
            dialogRef.afterClosed().subscribe(data=> {

              if(data && data["selected"] == "Yes") {
                this.generatingTraining = true;
                if(report.id) {
                  this.service.deleteTraining(report.id).subscribe(res=> {
                    training = this.prepareTrainingData()
                    this.generatingTraining = false;
                    this.trainingGenerated = true;
                  }, err=> {
                    this.generatingTraining = false;
                    this.snackbar.open(err.message, "close");
                  })
                } else {
                  training = this.prepareTrainingData()
                  this.generatingTraining = false;
                  this.trainingGenerated = true;
                }
              }
            })
          } else {
            training = this.prepareTrainingData()
            this.generatingTraining = false;
            this.trainingGenerated = true;
          }
        } else {
          training = this.prepareTrainingData()
          this.generatingTraining = false;
          this.trainingGenerated = true;
          let userStr = localStorage.getItem("auth.user")
          if(userStr) {
            let user = JSON.parse(userStr)
            let reportStr = localStorage.getItem("trainingReport")
            this.service.createTraining(user.id, JSON.parse(reportStr)).subscribe(res=> {
              if(res.status == 200) {
                localStorage.setItem("trainingReport", JSON.stringify(res.body))
                localStorage.setItem("trainingReport", JSON.stringify(training))
                localStorage.setItem("trainingStarted", "true")
                localStorage.setItem("trainingStartedOn", new Date().getTime()+"")
              }

            }, err=> {
              if(err.status == 429) {
                this.snackbar.open("You already have an active Training going on. Either delete or complete that first", "close")
              } else {
                this.snackbar.open("There was a problem in saving the traing report.", "close")
              }
            })
          } else {
            localStorage.setItem("trainingReport", JSON.stringify(training))
            localStorage.setItem("trainingStarted", "true")
            localStorage.setItem("trainingStartedOn", new Date().getTime()+"")
          }
        }

      }

      startTraining() {
        this.router.navigateByUrl("/tools/training")
      }
  }
