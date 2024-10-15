import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Puzzle } from 'src/app/models/puzzle';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-position-quiz-page',
  templateUrl: './position-quiz-page.component.html',
  styleUrls: ['./position-quiz-page.component.scss']
})
export class PositionQuizPageComponent implements OnInit {
  page : number = 2;
  rating = 1500
  count = 15;
  puzzles : Puzzle[]
  currentPuzzle : string
  puzzleIndex = 0;
  noMore: boolean;
  fetching : boolean = false;
  constructor(private service : ScriptChessServiceService, private snackBar : MatSnackBar,
    private analyticService : AnalyticsService, private storageService : StorageService) { }

  ngOnInit(): void {
    this.fetchPositions();
  }

  fetchPositions() {
    let puzzlePage = localStorage.getItem("puzzle-page");
    if(puzzlePage) {
      this.page = Number.parseInt(puzzlePage)
    }
    this.fetching = true;
    this.service.searchPuzzles("", "", "", this.rating, this.page, this.count).subscribe(res=>{
      if(res && res.body) {
        if(res.body.length >0) {
          this.fetching = false;
          this.puzzles = res.body;
          this.puzzles.forEach(puzzle=> {
            if(puzzle.eval) {
              let a = {
                fen : puzzle.fen,
                eval : puzzle.eval
              }
            }
          })
          this.currentPuzzle = this.puzzles[this.puzzleIndex].fen
          this.page++;
          localStorage.setItem("puzzle-page", this.page+"")
          if(this.rating > 500) {
            //this.analyticService.recordPuzzleSearched(this.theme, this.rating, pieces, this.opening)
          }
        } else {
          this.noMore = true;
        }

      }
    }, error=> {
      this.snackBar.open("Unable to fetch Positions at this time", "close");
    })
  }

  newPosition() {
    if(this.puzzleIndex >= this.puzzles.length) {
      this.fetchPositions()
      this.puzzleIndex = 0;
    } else {
      this.currentPuzzle = this.puzzles[this.puzzleIndex].fen;
      this.puzzleIndex++;
    }

  }
}
