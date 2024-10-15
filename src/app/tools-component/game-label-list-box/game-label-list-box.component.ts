import { Component, Input, OnInit } from '@angular/core';
import { Game } from 'src/app/models/game';

@Component({
  selector: 'app-game-label-list-box',
  templateUrl: './game-label-list-box.component.html',
  styleUrls: ['./game-label-list-box.component.scss']
})
export class GameLabelListBoxComponent implements OnInit {

  @Input()
  games : Game[] | undefined
  constructor() { }

  ngOnInit(): void {
  }

}
