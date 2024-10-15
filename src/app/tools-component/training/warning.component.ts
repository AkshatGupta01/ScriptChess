import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'warning',
  templateUrl: 'warning.html',
  styleUrls: ['./training.component.scss']
})

export class WarningDialogue {
  constructor(public dialogRef: MatDialogRef<WarningDialogue>,@Inject(MAT_DIALOG_DATA) public data: string) {

  }

  withoutLogin() {
    this.data = "continue"
    this.dialogRef.close(this.data)
  }

  signIn() {
    this.data = "sign in"
    this.dialogRef.close(this.data)
  }
}
