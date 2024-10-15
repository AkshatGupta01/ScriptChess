import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChessColors } from 'src/app/models/board.config';
import { AnalysisNameDialogeData } from './board-with-engine.component';

@Component({
    selector: 'analysis-name-dialog',
    templateUrl: 'analysis-name-dialog.html'
  })
  export class AnalysisNameDialog {
  
    name : string
    analysisName : any
    constructor(public dialogRef: MatDialogRef<AnalysisNameDialog>,
      @Inject(MAT_DIALOG_DATA) public data: AnalysisNameDialogeData) {
      this.name = data.name;
    }
  
    addName(nameBox) {
      this.data.name = nameBox.value
      this.dialogRef.close(this.data)
    }
    
  }