import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChessColors } from 'src/app/models/board.config';
import { MoveCommentDialogeData } from './board-with-engine.component';

@Component({
    selector: 'add-move-comment',
    templateUrl: 'add-comment-dialoge.html'
  })
  export class AddCommentDialogue {
  
    comment : string
    moveNumber : string

    constructor(public dialogRef: MatDialogRef<AddCommentDialogue>,@Inject(MAT_DIALOG_DATA) public data: MoveCommentDialogeData) {
      if(data.move.playedBy == ChessColors.white)
        this.moveNumber = data.move.moveNumber + "."
      else   
        this.moveNumber = data.move.moveNumber + ".."
    }
  
    addComment(commentBox) {
      this.data.comment = commentBox.value
      this.dialogRef.close(this.data)
    }

    onCommentEnter(comment) {}
    
  }