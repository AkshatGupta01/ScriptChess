import { Puzzle } from './../../models/puzzle';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { PuzzleCompleted } from 'src/app/rx/training/training.action';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';
import { chooseRandomItemsFromArray } from 'src/app/util/strings';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-position-solver-page',
  templateUrl: './position-solver.component.html',
  styleUrls: ['./position-solver.component.scss']
})
export class PositionSolverComponent implements OnInit {

  opening : string
  theme : string
  pawnChecked : boolean
  rookChecked : boolean
  knightChecked : boolean
  bishopChecked : boolean
  queenChecked : boolean
  puzzles : Puzzle[]
  currentPuzzle : Puzzle;
  page = 1;
  count = 15;
  trainingModecount = 100;
  puzzleIndex = 0;
  rating = 1000
  noMore : boolean = false;
  trainingMode = false;
  puzzleSlots = {}
  traningReport = null;
  trainingTheme = "";
  puzzleCount = 0;
  blindfoldPage = 1;
  blindfold = false;
  constructor(private service : ScriptChessServiceService, private snackBar : MatSnackBar,
    private analyticService : AnalyticsService, private route : ActivatedRoute, private store : Store) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(p=> {
      if(p["mode"]) {
        let reportStr = localStorage.getItem("trainingReport");
        if(p["rating"]) {
          this.rating = Number.parseInt(p["rating"])
        }
        if(reportStr) {
          let report = JSON.parse(reportStr)
          this.traningReport = report;
          if(report.gameInsightDone) {
            this.trainingMode = true;
            this.fetchAsPerReport(report)
            let completed = report.puzzlesCompleted
            this.page = completed / this.trainingModecount;
          }
        }


      }
       else {
        let puzzlePage = localStorage.getItem("puzzle-page");
        let blindPuzzlePage = localStorage.getItem("blind-puzzle-page");
        if(puzzlePage) {
          this.page = Number.parseInt(puzzlePage)
        }
        if(blindPuzzlePage) {
          this.blindfoldPage = Number.parseInt(blindPuzzlePage)
        }
        this.search()
       }
    })
  }

  onToggleBlindfold(blindfold) {
    this.blindfold = blindfold;
  }

  search() {
    this.trainingMode = false
    let pieces = "";
    this.noMore = false;
    if(this.pawnChecked) {
      pieces = "p"
    }
    if(this.rookChecked) {
      pieces = pieces+",r"
    }
    if(this.knightChecked) {
      pieces = pieces+",n"
    }
    if(this.bishopChecked) {
      pieces = pieces+",b"
    }
    if(this.queenChecked) {
      pieces = pieces+",q"
    }
    pieces = pieces.startsWith(",") ? pieces.substring(1) : pieces;
    if(!this.blindfold)
      this.fetchPuzzles(pieces, this.count, this.page, this.rating, this.theme, this.opening)
    else  {
      this.service.searchBlindfoldPuzzles(this.rating, this.blindfoldPage, this.count).subscribe(res=> {
        if(res && res.body.length > 0) {
          this.puzzles = res.body;
          this.blindfoldPage++
          this.puzzleIndex = 0;
          this.currentPuzzle = this.puzzles[this.puzzleIndex]
          localStorage.setItem("blind-puzzle-page", this.blindfoldPage+"")
        }
      })
    }

  }

  fetchPuzzles(pieces, count, page, rating, theme, opening) {
    this.puzzles = null;
    this.service.searchPuzzles(opening, theme, pieces, rating, page, count).subscribe(res=> {
      if(res && res.body) {
        if(res.body.length >0) {
          this.puzzleIndex = 0;
          if(this.trainingMode) {
            this.puzzles = chooseRandomItemsFromArray(res.body, this.puzzleCount)
          } else {
            this.puzzles = res.body;
          }

          this.currentPuzzle = this.puzzles[this.puzzleIndex]
          this.currentPuzzle = {...this.puzzles[this.puzzleIndex], solved :true}
          this.page++;
          localStorage.setItem("puzzle-page", this.page+"")
          if(this.rating > 500) {
            this.analyticService.recordPuzzleSearched(this.theme, this.rating, pieces, this.opening)
          }
        } else {
          this.noMore = true;
          if(pieces && pieces.trim().length > 0 && (pieces.indexOf("p") < 0 ||  pieces.indexOf("P") < 0)) {
            this.snackBar.open("No Puzzle found withs elected pieces, Try selecting pawns as well")
          } else {
            this.page = 0;
            this.search();
          }

        }

      }
    }, error=> {
      this.snackBar.open("Unable to fetch Puzzles at this time", "close");
    })
  }

  onComplete(puzzle) {
    this.puzzleIndex++;
    if(this.puzzleIndex < this.puzzles.length) {
      this.currentPuzzle = {...this.puzzles[this.puzzleIndex], solved :true}
      this.currentPuzzle.solved = false;
      if(this.trainingMode) {
        this.store.dispatch(new PuzzleCompleted(this.currentPuzzle, this.trainingTheme))
      }
    }

    else {
      if(!this.trainingMode) {
        this.search()
        this.puzzleIndex = 0
        this.currentPuzzle = null;
        this.analyticService.recordPuzzleRequested(this.page + 1)
      } else {
        if(this.trainingMode) {
          this.store.dispatch(new PuzzleCompleted(this.currentPuzzle, this.trainingTheme))
        }
        this.page++;
        let reportStr = localStorage.getItem("trainingReport")
        if(reportStr) {
          this.traningReport = JSON.parse(reportStr)
          this.fetchAsPerReport(this.traningReport)
        }
      }

    }

  }

  fetchAsPerReport(report: any) {
    let accuracy = report.pieceAccuracies;
    let sortable = [];
    for (var vehicle in accuracy) {
        sortable.push([vehicle, accuracy[vehicle]]);
    }

    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });
    accuracy = sortable;
    accuracy.sort((a, b) => (a[1] > b[1]) ? 1: -1);
    this.puzzleSlots = {}
    let total = 0
    if(accuracy[0][1] < 80) {
      this.puzzleSlots[accuracy[0][0]] = 20
      total += 20
    } else {
      this.puzzleSlots[accuracy[0][0]] = 10
      total += 10
    }

    if(accuracy[1][1] < 80) {
      this.puzzleSlots[accuracy[1][0]] = 20
      total += 20
    } else {
      this.puzzleSlots[accuracy[1][0]] = 10
      total += 10
    }
    if(accuracy[2][1] < 80) {
      this.puzzleSlots[accuracy[2][0]] = 20
      total += 20
    } else {
      this.puzzleSlots[accuracy[2][0]] = 10
      total += 10
    }
    this.puzzleSlots['all'] = 100 - total;

    let completed = report.puzzlesCompleted
    let pieces = "p";
    let page = 0;
    if(completed <this.puzzleSlots[accuracy[0][0]]) {
      pieces += "," + accuracy[0][0]
      this.puzzleCount = this.puzzleSlots[accuracy[0][0]]
    }

    if(completed >= this.puzzleSlots[accuracy[0][0]] && completed < this.puzzleSlots[accuracy[1][0]] + this.puzzleSlots[accuracy[0][0]]) {
      pieces += "," + accuracy[1][0]
      this.puzzleCount = this.puzzleSlots[accuracy[1][0]]
    }

    if(completed >= this.puzzleSlots[accuracy[0][0]] + this.puzzleSlots[accuracy[1][0]]
      && completed < this.puzzleSlots[accuracy[1][0]] + this.puzzleSlots[accuracy[0][0]] + this.puzzleSlots[accuracy[2][0]]) {
      pieces += "," + accuracy[2][0]
      this.puzzleCount = this.puzzleSlots[accuracy[2][0]]
    }

    if(completed >= this.puzzleSlots[accuracy[0][0]] + this.puzzleSlots[accuracy[1][0]] + this.puzzleSlots[accuracy[2][0]]
      && completed < environment.maxPuzzleCount) {
      page = Math.ceil((environment.maxPuzzleCount - completed) / this.trainingModecount)
      pieces += ",q,r,n,b"
      this.puzzleCount = this.puzzleSlots['all']
    }
    if(completed < this.puzzleSlots[accuracy[0][0]] + this.puzzleSlots[accuracy[1][0]] + this.puzzleSlots[accuracy[2][0]] + this.puzzleSlots['all']) {
      let piecesArr = pieces.split(",");
      if(piecesArr.length > 2) {
        this.trainingTheme = "All pieces"
      } else {
        this.trainingTheme = piecesArr[1];
      }
      this.fetchPuzzles(pieces, this.trainingModecount, page, this.rating, this.theme, this.opening)
    } else {
      this.snackBar.open("Training of " + environment.maxPuzzleCount + " puzzles completed. Exiting Training mode", "close")
      this.trainingMode = false;
      this.search();
    }

  }

}
