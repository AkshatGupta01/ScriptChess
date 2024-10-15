import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/models/comment';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';

@Component({
  selector: 'app-comments-box',
  templateUrl: './comments-box.component.html',
  styleUrls: ['./comments-box.component.scss']
})
export class CommentsBoxComponent implements OnInit {

  @Input()
  type : string

  @Input()
  slug : string

  comments : Comment[]

  constructor(private service : ScriptChessServiceService) { }

  ngOnInit(): void {
    this.service.fetchComents(this.type, this.slug).subscribe(res=> {
      if(res.body && res.body.length > 0) {
        this.comments = res.body;
      }
    })
  }

}
