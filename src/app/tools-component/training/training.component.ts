import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GameSearchParams } from 'src/app/models/game-search-params';
import { GameStorageSchema } from 'src/app/models/storage-models';
import { PuzzleCompletionReport, TrainingReport } from 'src/app/models/training';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';
import { WarningDialogue } from './warning.component';
import { BulkAnalyzerSummary } from 'src/app/models/bulk-analyzer-summary';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { AlertDialogeComponent } from 'src/app/common/alert-dialoge/alert-dialoge.component';

@Component({
  selector: 'app-training-component',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {

  lastDate : Date = null;
  trainingStarted = false;
  trainingProgressReport : TrainingReport = null;
  expired = false;
  currentRating = 0;
  targetRating = 0;
  fetchingGames = false;
  missedWeaknessesArr = []
  generateInsighPhase = false;
  fetchingGameInsight = false;
  insights : BulkAnalyzerSummary[]
  summary : BulkAnalyzerSummary
  whiteAdvantageLostData: any[] = [];
  blackAdvantageLostData: any[] = [];
  loggedInUser = false;
  generatingTraining = false;
  currentUser = null;
  savingTraining = false;
  activeTrainingReportStr: string;
  constructor(private router : Router, private snackbar : MatSnackBar, private service : ScriptChessServiceService,
     private storageService : StorageService, public dialog: MatDialog, private analyticService : AnalyticsService) {
    this.checkSavedTraining();
  }

  checkSavedTraining() {
    this.trainingStarted = (/true/i).test(localStorage.getItem("trainingStarted"))
    let time = localStorage.getItem("trainingStartedOn");
    if(time) {
      let report = localStorage.getItem("trainingReport");
      let timeNum = Number.parseInt(time)
      timeNum = timeNum + (7 * 24 * 3600 * 1000)
      this.lastDate = new Date(timeNum);
      if(timeNum < new Date().getTime()) {
        this.expired = true;
      }
      if(report) {
        this.trainingProgressReport = JSON.parse(report);
        this.currentRating = this.trainingProgressReport.currentAvgRating
        this.targetRating = this.trainingProgressReport.targetRating
      }
    }
  }

  updateRating() {
    let reportStr = localStorage.getItem("trainingReport");
    let report = JSON.parse(reportStr);
    report.currentAvgRating = this.currentRating;
    report.targetRating = this.targetRating;
    localStorage.setItem("trainingReport", JSON.stringify(report))
    this.trainingProgressReport = report;
    if(this.loggedInUser) {
      this.service.updateActiveTraining().subscribe(res=>{
        this.analyticService.recordTrainingRatingUpdated(this.targetRating)
        window.location.reload()
      });
    } else {
      this.analyticService.recordTrainingRatingUpdated(this.targetRating)
      window.location.reload()
    }


  }

  restartTraining() {
    //event.preventDefault();
    if(this.trainingProgressReport.id) {
      this.service.deleteTraining(this.trainingProgressReport.id).subscribe(res=> {
        this.expired = false;
        if(localStorage.getItem("trainingReport")) {
          localStorage.removeItem("trainingReport")
        }
        this.startTraining();
      }, err=> {
        this.snackbar.open(err.message, "close")
      })
    } else {
      this.expired = false;
      if(localStorage.getItem("trainingReport")) {
        localStorage.removeItem("trainingReport")
      }
      this.startTraining();
    }
  }

  ngOnInit(): void {
    let userStr = localStorage.getItem("auth.user")
    if(userStr) {
      this.currentUser = JSON.parse(userStr);
      this.loggedInUser = true;
    } else {
      this.loggedInUser = false;
    }
    this.activeTrainingReportStr = localStorage.getItem("activeTrainigReport")

    if(!this.trainingProgressReport) {
      let userStr = localStorage.getItem("auth.user")
      if(userStr) {
        let user = JSON.parse(userStr);
        this.service.getActiveTraining(user.id).subscribe(res=> {
          if(res.status == 200 && res.body) {
            this.trainingProgressReport = res.body;
            this.trainingProgressReport.startedOn = new Date(this.trainingProgressReport.startedOn)
            this.trainingProgressReport.saved = true;
            localStorage.setItem("trainingStarted", "true")
            localStorage.setItem("trainingStartedOn", this.trainingProgressReport.startedOn.getTime()+"")
            localStorage.setItem("trainingReport", JSON.stringify(this.trainingProgressReport))
            this.checkSavedTraining()
          }
        })
      }
    } else {
      this.checkTrainingCompletion();
    }

  }

  fetchSavedInsights() {
    let userStr = localStorage.getItem("auth.user")
    if(userStr) {
      let user = JSON.parse(userStr);
      this.fetchingGameInsight = true;
      this.service.fetchGameInsights(user.id).subscribe(res=> {
        this.insights = res.body;
        this.fetchingGameInsight = false;
      }, err=> {
        this.fetchingGameInsight = false;
        this.snackbar.open(err.message, "close")
      })
    }
  }

  startTraining() {
    this.trainingStarted = false;
    if(!this.generateInsighPhase) {
      this.generateInsighPhase = true;
      let userStr = localStorage.getItem("auth.user")
      if(userStr) {
        let user = JSON.parse(userStr);
        this.loggedInUser = true;
        this.fetchSavedInsights()
      } else {
        this.loggedInUser = false;
      }
    }
  }
  startTraining1() {
    let userStr = localStorage.getItem("auth.user")
    if(userStr) {
      let user = JSON.parse(userStr)
      this.createReport();
      this.service.createTraining(user.id, this.trainingProgressReport).subscribe(res=> {
        //creates training
        this.trainingProgressReport = res.body;
        this.trainingProgressReport.saved = true;
        localStorage.setItem("trainingReport", JSON.stringify(this.trainingProgressReport))

      }, err=> {
        if(err.status == 429) {
          this.service.getActiveTraining(user.id).subscribe(res=> {
            if(res.status == 200) {
              this.trainingProgressReport = res.body;
            }
          })
        }
        this.snackbar.open("We couldn't save your training on server. But you can continue training here", "close")
      })
    } else {

      const dialogRef = this.dialog.open(WarningDialogue)
      dialogRef.afterClosed().subscribe(data=> {
        if(data == "continue") {
          this.createReport();
        } else {
          if(data == "sign in") {
            this.router.navigateByUrl("/sign-in")
          }
        }
      })
    }
  }

  createReport() {
    let now = new Date();
    localStorage.setItem("trainingStarted","true")
    localStorage.setItem("trainingStartedOn",now.getTime()+"")
    this.trainingStarted = true
    this.trainingProgressReport = {
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
    localStorage.setItem("trainingReport", JSON.stringify(this.trainingProgressReport))
  }

  startPuzzles() {
    if(this.trainingProgressReport.currentAvgRating == 0 || this.trainingProgressReport.targetRating == 0) {
      this.snackbar.open("Please Update the current and target rating", "close")
      return;
    }
    if(this.trainingProgressReport.gameInsightDone) {
      this.router.navigateByUrl('/tools/chess-puzzles?mode=training&rating=' + (Number.parseInt(this.targetRating + "") + 200))
    } else {
      this.snackbar.open("Please complete a game review first", "close")
    }

  }

  startPositions() {
    if(this.trainingProgressReport.currentAvgRating == 0 || this.trainingProgressReport.targetRating == 0) {
      this.snackbar.open("Please Update the current and target rating", "close")
      return;
    }
    if(this.trainingProgressReport.gameInsightDone)
      this.router.navigateByUrl('/tools/position-quiz?mode=training')
    else
      this.snackbar.open("Please complete a game review first", "close")
  }

  playWithBots() {
    if(this.trainingProgressReport.currentAvgRating == 0 || this.trainingProgressReport.targetRating == 0) {
      this.snackbar.open("Please Update the current and target rating", "close")
      return;
    }
    if(this.trainingProgressReport.gameInsightDone)
      this.router.navigateByUrl('/tools/play-against-chess-bots?mode=training&rating=' + this.trainingProgressReport.targetRating)
    else
      this.snackbar.open("Please complete a game review first", "close")
  }

  fetchGamesToReview() {
    if(this.trainingProgressReport.reviewFullGames && this.trainingProgressReport.reviewFullGames.length > 0) {
      this.snackbar.open("Game have been fetched already", "close")
      return;
    }
    this.trainingProgressReport.reviewFullGames = []
    this.trainingProgressReport.reviewedGameByOpening = []
    this.fetchingGames = true;
    let gamesPerOpening =  Math.ceil(environment.gamesReviewsToComplete / this.trainingProgressReport.openingsToStudy.length)
    this.trainingProgressReport.openingsToStudy.forEach(opening=> {
      let eco = opening.eco;
      let result = opening.playAs == "white" ? "1-0" : "0-1";
      let searchParams : GameSearchParams =  {
        eco : eco,
        result : result
      }

      this.service.searchGames(searchParams, 1, 10).subscribe(res=> {
        if(res && res.status == 200) {
          if(res.body.length > 0) {
            let random = 0;
            let games = res.body;
            for(let index = 0; index < gamesPerOpening; index++) {
              random = Math.random();
              random = Math.floor(random) * games.length;
              this.trainingProgressReport.reviewFullGames.push(games[random])
              games.splice(random, 1);
              this.trainingProgressReport.reviewedGameByOpening.push({
                eco : eco,
                name : opening.name,
                playAs :opening.playAs,
                game : games[random]
              })

            }
          } else {
            searchParams =  {
            }
            this.service.searchGames(searchParams, 1, 10).subscribe(res=> {
              if(res.body.length > 0) {
                let random = 0;
                let games = res.body;
                for(let index = 0; index < gamesPerOpening; index++) {
                  random = Math.floor(Math.random()) * games.length;
                  this.trainingProgressReport.reviewFullGames.push(games[random])
                  games.splice(random, 1);
                  this.trainingProgressReport.reviewedGameByOpening.push({
                    eco : eco,
                    name : opening.name,
                    playAs :opening.playAs,
                    game : games[random]
                  })
                }
              }
            })
          }
          this.trainingProgressReport.reviewFullGames = this.trainingProgressReport.reviewFullGames.slice(0, 10);
          if(this.trainingProgressReport.reviewFullGames.length >= environment.gamesReviewsToComplete) {
            this.fetchingGames = false;
            localStorage.setItem("trainingReport", JSON.stringify(this.trainingProgressReport))

          }
        }
      })
    })
  }

  reviewGame(gameId, result) {
    let playAs = result == "1-0" ? "white" : "black"
    const link = this.router.serializeUrl(this.router.createUrlTree(['/tools/free-chess-engine'], { queryParams:{fetchgameId : gameId,"mode": "training", "playAs" : playAs} }));
    window.open(link);
  }

  checkTrainingCompletion() {
    if(this.trainingProgressReport && this.trainingProgressReport.botsGames == this.trainingProgressReport.botsGamesToBePlayed &&
      this.trainingProgressReport.gamesReviewCompleted == this.trainingProgressReport.gamesReviewsToComplete &&
      this.trainingProgressReport.positionQuizesCompleted == this.trainingProgressReport.maxPositionQuizeToComplete &&
      this.trainingProgressReport.puzzlesCompleted == this.trainingProgressReport.maxPuzzleCount) {
        this.trainingProgressReport.completedOn = new Date().getTime();
        //calculate Puzzle Accuracies
        //all pieces
        let failedToSolve = 0;
        let puzzleAccuracy: PuzzleCompletionReport = {}
        let solved = 0
        let attempts = 0
        this.trainingProgressReport.allPiecesPuzzle.forEach(p=> {
          if(p.solved) {
            solved++
          } else {
            failedToSolve++;
          }
          if(p.attempt)
            attempts += p.attempt;
        })
        puzzleAccuracy.allPiecePuzzleAccuracy = (solved / this.trainingProgressReport.allPiecesPuzzle.length) * 100;
        puzzleAccuracy.attemptPerAllPuzzles = (attempts / this.trainingProgressReport.allPiecesPuzzle.length)
        //rook
        if(this.trainingProgressReport.rookPuzzles) {
          solved = 0
          attempts = 0
          this.trainingProgressReport.rookPuzzles.forEach(p=> {
            if(p.solved) {
              solved++
            } else {
              failedToSolve++;
            }
            if(p.attempt)
              attempts += p.attempt;
          })
          puzzleAccuracy.rookPuzzleAccuracy = (solved / this.trainingProgressReport.rookPuzzles.length) * 100;
          puzzleAccuracy.attemptPerRookPuzzles = (attempts / this.trainingProgressReport.rookPuzzles.length)
        }


        //knight
        if(this.trainingProgressReport.knightPuzzles) {
          solved = 0
          attempts = 0
          this.trainingProgressReport.knightPuzzles.forEach(p=> {
            if(p.solved) {
              solved++
            } else {
              failedToSolve++;
            }
            if(p.attempt)
              attempts += p.attempt;
          })
          puzzleAccuracy.knightPuzzleAccuracy = (solved / this.trainingProgressReport.knightPuzzles.length) * 100;
          puzzleAccuracy.attemptPerKnightPuzzles = (attempts / solved)
        }


        //bishop
        if(this.trainingProgressReport.bishopPuzzles) {
          solved = 0
          attempts = 0
          this.trainingProgressReport.bishopPuzzles.forEach(p=> {
            if(p.solved) {
              solved++
            } else {
              failedToSolve++;
            }
            if(p.attempt)
              attempts += p.attempt;
          })
          puzzleAccuracy.bishopsPuzzleAccuracy = (solved / this.trainingProgressReport.bishopPuzzles.length) * 100;
          puzzleAccuracy.attemptPerBishopPuzzles = (attempts / this.trainingProgressReport.bishopPuzzles.length)
        }

        //queen
        if(this.trainingProgressReport.queenPuzzles) {
          solved = 0
          attempts = 0
          this.trainingProgressReport.queenPuzzles.forEach(p=> {
            if(p.solved) {
              solved++
            } else {
              failedToSolve++;
            }
            if(p.attempt)
              attempts += p.attempt;
          })
          puzzleAccuracy.queenPuzzleAccuracy = (solved / this.trainingProgressReport.queenPuzzles.length) * 100;
          puzzleAccuracy.attemptPerQueenPuzzles = (attempts / this.trainingProgressReport.queenPuzzles.length)
        }
        this.trainingProgressReport.puzzleCompletionReport = puzzleAccuracy
        this.trainingProgressReport.puzzleCompletionReport.failedToSolve = failedToSolve

        //position Analysis
        solved = 0
        this.trainingProgressReport.completedPositions.forEach(p=> {
          if(p.solved) {
            solved ++
          }
        })
        this.trainingProgressReport.positionalQuizSolved = solved;
        this.trainingProgressReport.positionAnalysisAccuracies = (solved / this.trainingProgressReport.completedPositions.length) * 100;

        this.trainingProgressReport.completed = true;
        if(this.trainingProgressReport.missedWeaknesses) {
          Object.keys(this.trainingProgressReport.missedWeaknesses).forEach(w=> {
            this.missedWeaknessesArr.push(w,this.trainingProgressReport.missedWeaknesses[w])
          })
        }
        localStorage.setItem("trainingReport", JSON.stringify(this.trainingProgressReport))
        this.service.updateActiveTraining();
      }
  }

  newTrainingSession() {
    let archivedTrainingStr = localStorage.getItem("archivedTrainings")
    let archivedTrainings = []
    if(archivedTrainingStr) {
      archivedTrainings = JSON.parse(archivedTrainingStr)
    }

    archivedTrainings.push(this.trainingProgressReport)
    localStorage.setItem("archivedTrainings", JSON.stringify(archivedTrainings))
    localStorage.removeItem("trainingReport")
    localStorage.removeItem("trainingStarted")
    localStorage.removeItem("trainingStartedOn")
    this.generateInsighPhase = false
    this.trainingProgressReport = null
    this.startTraining()
  }

  loadInsight(insightId) {
    this.service.fetchGameInsight(insightId).subscribe(res=> {
      this.summary = res.body;
      this.generatingTraining = true
      this.prepareTrainingData();
      this.generatingTraining = false
      this.generateInsighPhase = false;
      this.trainingStarted = true;
    }, err => {
      this.snackbar.open(err.message, "close")
    })
  }

  prepareTrainingData() {
    let trainingReport = localStorage.getItem("trainingReport")
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
    if (this.summary.whiteMiddleAdvantageLost > 0)
          this.whiteAdvantageLostData.push(["Middle Game", this.summary.whiteMiddleAdvantageLost])
      if (this.summary.whiteEndAdvantageLost > 0)
          this.whiteAdvantageLostData.push(["End game", this.summary.whiteEndAdvantageLost])
      if (this.summary.blackMiddleAdvantageLost > 0)
          this.blackAdvantageLostData.push(["Middle Game", this.summary.blackMiddleAdvantageLost])
      if (this.summary.blackEndAdvantageLost > 0)
          this.blackAdvantageLostData.push(["End game", this.summary.blackEndAdvantageLost])
    training.misplayedPositions = this.summary.practicePositions
    training.gameInsightDone = true
    training.openingAnalysisSummaryData = this.summary.openingAnalysisSummaryData;
    training.middleGameAnalysisSummaryData = this.summary.middleGameAnalysisSummaryData;
    training.endgameAnalysisSummaryData = this.summary.endgameAnalysisSummaryData;
    training.whiteAdvantageLostData = this.whiteAdvantageLostData
    training.blackAdvantageLostData = this.blackAdvantageLostData;
    training.missedWeaknesses = this.summary.missedWeaknesses
    this.trainingProgressReport = training;

    startedOn = startedOn + (7 * 24 * 3600 * 1000)
    this.lastDate = new Date(startedOn);

    this.service.createTraining(this.currentUser.id, this.trainingProgressReport).subscribe(res=> {
      if(res.status == 200 && res.body) {
        this.trainingProgressReport = res.body;
        localStorage.setItem("trainingReport", JSON.stringify(this.trainingProgressReport))
        localStorage.setItem("trainingStarted", "true")
        localStorage.setItem("trainingStartedOn", startedOn + "")
      }
    }, err=> {
      if(err.status == 429) {
        this.snackbar.open("You already have an active Training going on. Either delete or complete that first", "close")
      } else {
        this.snackbar.open("There was a problem in saving the traing report.", "close")
      }

    })

    this.analyticService.recordTrainingStarted(true)

  }

  deleteTraining() {
    let data = {
      data : {
        message : "Training is still in progress. Are you sure to delete this training?",
        option1Str : "No",
        option2Str : "Yes",
      }
    }
    let dialogRef = this.dialog.open(AlertDialogeComponent, data);
    dialogRef.afterClosed().subscribe(data=> {
      if(data && data["selected"] == "Yes") {
        let reportRef = localStorage.getItem("trainingReport")
        if(reportRef) {
          let report = JSON.parse(reportRef)
          if(report.id) {
            this.service.deleteTraining(report.id).subscribe(res=>{}, err=> {this.snackbar.open(err.message, "close")})
          }
          localStorage.removeItem("trainingReport")
          localStorage.removeItem("trainingStarted")
          localStorage.removeItem("trainingStartedOn")
          window.location.reload()
        }
      }
    })
  }
  saveTraining() {
    if(this.savingTraining) {
      return
    }
    this.savingTraining = true;
    this.service.createTraining(this.currentUser.id, this.trainingProgressReport).subscribe(res=> {
      this.savingTraining = false;
      if(res.status == 200) {
        this.trainingProgressReport = res.body;
        localStorage.setItem("trainingReport", JSON.stringify(this.trainingProgressReport))
      }
    }, err=> {
      this.savingTraining = false;
      this.snackbar.open(err.message, "close")
    })
  }

  restoreTraining() {
    let data = {
      data : {
        message : "Current training progress will be lost and your active training will be restored. Do you want to continue?",
        option1Str:"No",
        option2Str:"Yes"
      }

    }
    if(this.activeTrainingReportStr) {
      let ref = this.dialog.open(AlertDialogeComponent, data)
      ref.afterClosed().subscribe(data=> {
        if(data && data["selected"] == "Yes") {
          localStorage.setItem("trainingReport", localStorage.getItem("activeTrainigReport"))
          localStorage.removeItem("activeTrainigReport")
          window.location.reload()
        }
      })
    }
  }
}
