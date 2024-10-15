import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { environment } from "src/environments/environment";

@Component({
  selector: 'max-analysis-warning',
  templateUrl: 'max-analysis-warning.html',
  styleUrls: ['../training/training.component.scss']
})

export class MaxAnalysisWarning {
  count = 0
  constructor(public dialogRef: MatDialogRef<MaxAnalysisWarning>,@Inject(MAT_DIALOG_DATA) public data: string) {
    this.count = environment.maxGameCountPerBulkAnalysis
  }

  continue() {
    this.data = "continue"
    this.dialogRef.close(this.data)
  }

  cancel() {
    this.data = "cancel"
    this.dialogRef.close(this.data)
  }
}
