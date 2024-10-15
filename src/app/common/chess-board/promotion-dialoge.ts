import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from './chess-board.component';

@Component({
    selector: 'choose-promotion',
    templateUrl: 'choose-promotion.html'
  })
  export class PromotionDialog {
  

  
    constructor(public dialogRef: MatDialogRef<PromotionDialog>,@Inject(MAT_DIALOG_DATA) public data: DialogData) {

    }
  
    choose(piece) {
        this.dialogRef.close(piece)
    }
    
  }