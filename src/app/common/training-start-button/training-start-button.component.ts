import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TrainingDownloaded, TrainingUpdated } from 'src/app/rx/training/training.action';
import { selectPuzzleCompleted, selectTrainingReport } from 'src/app/rx/training/training.selector';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';

@Component({
  selector: 'app-training-start-button',
  templateUrl: './training-start-button.component.html',
  styleUrls: ['./training-start-button.component.scss']
})
export class TrainingStartButtonComponent implements OnInit {

  trainingStarted = false;
  constructor(private router : Router, private store : Store, private service : ScriptChessServiceService) {
    this.trainingStarted = (/true/i).test(localStorage.getItem("trainingStarted"))

  }

  ngOnInit(): void {
    let userStr = localStorage.getItem("auth.user")
    if(window.location.href.indexOf("/tools/training") > -1) {
      this.trainingStarted = false;
    }

    this.store.select(selectTrainingReport).subscribe(report=>{
      if(report) {
        localStorage.setItem("trainingReport", JSON.stringify(report))
        if(report.id)
          this.store.dispatch(new TrainingUpdated())
      }

    })

    let reportStr = localStorage.getItem("trainingReport")
    if(userStr) {
      let user = JSON.parse(userStr)
      this.service.getActiveTraining(user.id).subscribe(res=> {
        if(res.status == 200 && res.body && Object.keys(res.body).length > 0) {
          if(!reportStr) {
            localStorage.setItem("trainingReport", JSON.stringify(res.body))
            localStorage.setItem("trainingStarted", "true")
            let date = new Date(res.body.startedOn)
            localStorage.setItem("trainingStartedOn", date.getTime().toString())
            this.trainingStarted = true;
            this.store.dispatch(new TrainingDownloaded(res.body))
          } else {
            let report = JSON.parse(reportStr)
             if(report.owner != user.id)
               localStorage.setItem("activeTrainigReport", JSON.stringify(res.body))
          }

        }
      }, err=> {})
    }
  }

  openTrainingPortal() {
    this.router.navigateByUrl("/tools/training")
  }

}
