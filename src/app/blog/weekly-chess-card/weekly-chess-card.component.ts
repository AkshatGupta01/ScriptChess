import { Component, Input, OnInit } from '@angular/core';
import { Page } from 'src/app/models/post';

@Component({
  selector: 'app-weekly-chess-card',
  templateUrl: './weekly-chess-card.component.html',
  styleUrls: ['./weekly-chess-card.component.scss']
})
export class WeeklyChessCardComponent implements OnInit {

  @Input()
  weeklyChess : Page
  constructor() { }

  ngOnInit(): void {
  }

}
