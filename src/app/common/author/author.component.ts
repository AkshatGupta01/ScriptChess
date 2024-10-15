import { Component, Input, OnInit } from '@angular/core';
import { Author } from 'src/app/models/post';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
})
export class AuthorComponent implements OnInit {

  @Input()
  author : Author

  constructor() { }

  ngOnInit(): void {
  }

}
