import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Feedback } from 'src/app/models/feedback';
import { FeedbackAction } from 'src/app/rx/feedback';
import { selectFeedbackFormState } from 'src/app/rx/feedback/feedback.selectors';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent implements OnInit {

  name  :string
  feedback  :string
  feedbackSubmitted : boolean = false;
  rating: string;
  loading : boolean = false;
  page : string;
  BOT_PAGE = "/tools/play-against-chess-bots"
  ENGINE_PAGE = "/tools/free-chess-engine"
  constructor(public dialogRef: MatDialogRef<FeedbackFormComponent>, private store : Store, private service : ScriptChessServiceService, private route : Router) { }

  ngOnInit(): void {
    this.page = this.route.url;
    this.store.select(selectFeedbackFormState).subscribe(launched=> {
      if(!launched) {
        if(this.dialogRef.getState() != MatDialogState.CLOSED || this.dialogRef.getState() != MatDialogState.CLOSING) {
          this.dialogRef.close();
        }
      }
    })
  }


  submitFeedback() {
    this.loading = true;

    let feedback : Feedback = {
      name : this.name,
      date : new Date(),
      resolution : window.innerWidth + "x" + window.innerHeight,
      message : this.feedback,
      page : this.page,
      rating : this.rating ? Number.parseInt(this.rating) : null

    }

    this.service.submitFeedback(feedback).subscribe(res=> {
      if(res.status == 200) {
        this.loading = false;
        this.feedbackSubmitted = true;
        if(this.page == this.BOT_PAGE) {
          localStorage.setItem("feedback-bot", "true")
        }
        if(this.page == this.ENGINE_PAGE) {
          localStorage.setItem("feedback-engine", "true")
        }

      }
    })
  }
  close() {
    this.store.dispatch(new FeedbackAction.CloseFeedbackForm())
  }

  ratingClicked(value) {
    this.rating = value;

  }
}
