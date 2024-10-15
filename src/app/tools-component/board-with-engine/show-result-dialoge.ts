import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChessColors } from 'src/app/models/board.config';
import { CommentDialogeData, GameResultDialogeData, MoveCommentDialogeData } from './board-with-engine.component';

@Component({
    selector: 'show-move-comment',
    templateUrl: 'show-result-dialoge.html'
  })
  export class ShowResultDialogue {
  
    winMsg : string

    constructor(public dialogRef: MatDialogRef<ShowResultDialogue>,@Inject(MAT_DIALOG_DATA) public data: GameResultDialogeData) {
      switch(data.result) {
        case "1-0":
          this.winMsg = "White Won";
          break
        case "0-1":
          this.winMsg = "Black Won";
          break
        case "1/2-1/2":
          this.winMsg = "Game Drawn";
          break  
      }
    }
    
  }