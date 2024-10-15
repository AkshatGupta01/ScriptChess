import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Move, MoveDetails } from 'src/app/models/move';
import { moveSummary } from 'src/app/static-data/move-summary';

@Component({
  selector: 'app-move-label-list-box',
  templateUrl: './move-label-list-box.component.html',
  styleUrls: ['./move-label-list-box.component.scss']
})
export class MoveLabelListBoxComponent implements OnInit {

  movesMap : any = moveSummary[0];
  moves : string[] = [];

  @Input()
  showGameCounts = true;

  @Input()
  currentMoveIndex = 0;

  choosenMoves = "";

  @Input()
  moveDetailList : MoveDetails[]

  @Input()
  sameBackground = false;

  @Output()
  onMoveSelect = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    this.moves = Object.keys(this.movesMap);
  }

  moveClicked(event : any) {
    this.onMoveSelect.emit(event);
  }
}
