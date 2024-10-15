import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-post-card-long',
  templateUrl: './post-card-long.component.html',
  styleUrls: ['./post-card-long.component.scss']
})
export class PostCardLongComponent implements OnInit {

  @Input()
  post : Post | undefined
  constructor() { }

  ngOnInit(): void {
  }

}
