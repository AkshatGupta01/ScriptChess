import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'summary-save-dialog',
  templateUrl: 'summary-save-dialoge.html',
})

export class SummaryDialog {
  name = "name"
  comment = ""
  constructor(public dialogRef: MatDialogRef<SummaryDialog>,@Inject(MAT_DIALOG_DATA) public data: any) {

  }

  saveAnalysis(nameTxt, commentTxt) {
    this.data = {}
    this.data["name"] = nameTxt.value;
    this.data["comment"] = commentTxt.value;
    this.dialogRef.close(this.data)
  }
}
