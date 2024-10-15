import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChessColors } from 'src/app/models/board.config';
import { CommentDialogeData, MoveCommentDialogeData } from './board-with-engine.component';

@Component({
    selector: 'show-move-comment',
    templateUrl: 'show-comment-dialoge.html'
  })
  export class ShowCommentDialogue {
  
    comment : string
    moveNumber : string

    constructor(public dialogRef: MatDialogRef<ShowCommentDialogue>,@Inject(MAT_DIALOG_DATA) public data: CommentDialogeData) {
      if(data.move.playedBy == ChessColors.white)
        this.moveNumber = data.move.moveNumber + "."
      else   
        this.moveNumber = data.move.moveNumber + ".."
    }
    
  }