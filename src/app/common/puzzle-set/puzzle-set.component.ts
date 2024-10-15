import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Puzzle } from 'src/app/models/puzzle';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';

@Component({
  selector: 'app-puzzle-set',
  templateUrl: './puzzle-set.component.html',
  styleUrls: ['./puzzle-set.component.scss']
})
export class PuzzleSetComponent implements OnInit {

  @Input()
  puzzleSet : string

  @Input()
  title : string
  puzzles : Puzzle[]
  currentPuzzle : Puzzle;
  page = 1;
  count = 15;
  puzzleIndex = 0;
  rating = 500
  completed = false;
  constructor(private service : ScriptChessServiceService, private snackBar : MatSnackBar) { }

  ngOnInit(): void {
    let idArr = this.puzzleSet.split(",");
    this.service.searchPuzzlesByIds(idArr).subscribe(res=> {
      this.setPuzzles(res);
    })
  }

  setPuzzles(res) {
    if(res && res.body) {
      if(res.body.length >0) {
        this.puzzles = res.body;
        this.currentPuzzle = this.puzzles[this.puzzleIndex]
        this.page++;
      }      
    }

  }

  onComplete() {
    this.puzzleIndex++;
    if(this.puzzleIndex < this.puzzles.length) {
      this.currentPuzzle = this.puzzles[this.puzzleIndex]
    } else {
      this.completed = true;
    }
    
  }


}
