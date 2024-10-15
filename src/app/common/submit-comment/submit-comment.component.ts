import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Comment } from 'src/app/models/comment';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';

@Component({
  selector: 'app-submit-comment',
  templateUrl: './submit-comment.component.html',
  styleUrls: ['./submit-comment.component.scss']
})
export class SubmitCommentComponent implements OnInit {

  name : string
  email : string
  comment : string

  @Input()
  type : string

  @Input()
  slug : string
  submitting : boolean = false
  submitted : boolean = false;
  constructor(private service : ScriptChessServiceService, private snackbar : MatSnackBar) { }

  ngOnInit(): void {
  }

  submitComment() {
    this.submitting = true;
    let comment : Comment = {
      name : this.name,
      email : this.email,
      date : new Date(),
      parentType : this.type,
      parentSlug : this.slug,
      comment : this.comment
    }

    this.service.submitComent(comment).subscribe(res=> {
      if(res.status == 200) {
        this.submitting = false;
        this.snackbar.open("Comment submitted", "close")
      }
    }, err=> {
      this.snackbar.open("There was an error in submitting your comment", "close")
    })
  }
}
