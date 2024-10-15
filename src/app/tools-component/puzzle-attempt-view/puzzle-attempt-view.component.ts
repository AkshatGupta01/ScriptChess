import { Component, Input, OnInit } from '@angular/core';
import { Puzzle } from 'src/app/models/puzzle';
import { generateRandomID } from 'src/app/util/strings';

@Component({
  selector: 'app-puzzle-attempt-view',
  templateUrl: './puzzle-attempt-view.component.html',
  styleUrls: ['./puzzle-attempt-view.component.scss']
})
export class PuzzleAttemptViewComponent implements OnInit {

  @Input()
  puzzle : Puzzle
  boardId : string = "";
  @Input()
  height = "250px";
  constructor() {
    this.boardId = generateRandomID(5).trim();
  }

  ngOnInit(): void {
  }

}
