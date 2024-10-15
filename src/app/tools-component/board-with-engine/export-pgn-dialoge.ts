import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChessColors } from 'src/app/models/board.config';
import { CommentDialogeData, GameResultDialogeData, MoveCommentDialogeData, PgnDialogeData } from './board-with-engine.component';

@Component({
    selector: 'show-move-comment',
    templateUrl: 'show-result-dialoge.html'
  })
  export class ExportPgnDialoge {
  
    winMsg : string

    constructor(public dialogRef: MatDialogRef<ExportPgnDialoge>,@Inject(MAT_DIALOG_DATA) public data: PgnDialogeData) {
      
    }
    
  }