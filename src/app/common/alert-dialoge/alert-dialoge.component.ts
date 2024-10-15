import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialoge',
  templateUrl: './alert-dialoge.component.html',
  styleUrls: ['./alert-dialoge.component.scss']
})
export class AlertDialogeComponent implements OnInit {

  message : string
  option1Str : string
  option2Str : string
  constructor(public dialogRef: MatDialogRef<AlertDialogeComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
    if(data["message"])
      this.message = data["message"]
    if(data["option1Str"])
      this.option1Str = data["option1Str"]
    if(data["option2Str"])
      this.option2Str = data["option2Str"]

  }

  ngOnInit(): void {
  }

  option1(){
    this.data["selected"] = this.option1Str
    this.dialogRef.close(this.data)
  }

  option2(){
    this.data["selected"] = this.option2Str
    this.dialogRef.close(this.data)

  }

}
