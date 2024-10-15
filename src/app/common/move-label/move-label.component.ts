import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-move-label',
  templateUrl: './move-label.component.html',
  styleUrls: ['./move-label.component.scss']
})
export class MoveLabelComponent implements OnInit {

  @Input()
  move : string | undefined;

  @Input()
  count : number | undefined;

  @Input()
  whiteWonCount : number | undefined;

  @Input()
  drawCount : number | undefined;

  @Input()
  blackWonCount : number | undefined;

  @Input()
  index : number = 0;

  @Input()
  showGameCounts = true;

  @Input()
  novalty : boolean

  moveNum : string;

  moveClass : string = "odd"

  @Output()
  onClick = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    if(this.index %2 == 0) {      
      this.moveNum = Math.floor(this.index / 2)+".";
      this.moveClass = "even"
    } else {
      this.moveNum = Math.ceil(this.index / 2)+"";
      this.moveClass = "odd"
    }
  }


  moveClicked(move : string | undefined) {
    this.onClick.emit(move);
  }

}
