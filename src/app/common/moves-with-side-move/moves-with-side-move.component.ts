import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { ChessColors } from 'src/app/models/board.config';
import { Move } from 'src/app/models/move';

@Component({
  selector: 'app-moves-with-side-move',
  templateUrl: './moves-with-side-move.component.html',
  styleUrls: ['./moves-with-side-move.component.scss']
})
export class MovesWithSideMoveComponent implements OnInit {

  @Input()
  move : Move

  @Input()
  index : number

  selectedMove : Move;

  @Output()
  onMoveClick = new EventEmitter();

  @Output()
  onCommentClick = new EventEmitter();

  @Output()
  onRightClick = new EventEmitter();

  chessColors = ChessColors

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(change : SimpleChange) {
    console.log(change)
    console.log(this.move)
  }

  moveClicked() {
    this.onMoveClick.emit(this.move)
    this.selectedMove = this.move;
  }

  innerMoveClicked(move) {
    this.onMoveClick.emit(move)
    this.selectedMove = move;
  }

  onCommentPressed(move) {
    this.onCommentClick.emit(move);
  }

  onContextClick(event, move) {
    this.onRightClick.emit({event, move});
  }

  onInnerRightClick(event) {
    this.onRightClick.emit(event);
  }

}
