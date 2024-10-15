import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { FeedbackAction } from 'src/app/rx/feedback';
import { LaunchFeedbackForm } from 'src/app/rx/feedback/feedback.action';
import { selectFeedbackFormState } from 'src/app/rx/feedback/feedback.selectors';
import { FeedbackFormComponent } from '../feedback-form/feedback-form.component';

@Component({
  selector: 'app-feedback-button',
  templateUrl: './feedback-button.component.html',
  styleUrls: ['./feedback-button.component.scss']
})
export class FeedbackButtonComponent implements OnInit {

  feedbackFormOpened = false;
  constructor(public dialog: MatDialog, private store : Store) { }

  ngOnInit(): void {
    this.store.select(selectFeedbackFormState).subscribe(launched=> {
      if(launched) {
        this.launchFeedbackForm();
      }
    })
  }

  launchFeedbackForm() {
    const dialogRef = this.dialog.open(FeedbackFormComponent, {
     
    });
    dialogRef.afterClosed().subscribe(()=>{ 
      this.store.dispatch(new FeedbackAction.CloseFeedbackForm())
    })
  }

  openFeedbackForm() {
    if(!this.feedbackFormOpened)
      this.store.dispatch(new FeedbackAction.LaunchFeedbackForm());
    else       
      this.store.dispatch(new FeedbackAction.CloseFeedbackForm());
  }

}
