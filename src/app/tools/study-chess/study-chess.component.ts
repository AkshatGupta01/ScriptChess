import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-study-chess',
  templateUrl: './study-chess.component.html',
  styleUrls: ['./study-chess.component.scss']
})
export class StudyChessComponent implements OnInit {

  startingPosition : string = "8/6K1/1r6/5k2/R7/P7/1P6/8 w - - 0 1"
  //startingPosition : string = "8/1P6/1K4k1/8/8/8/8/8 w - - 0 1"
  engineDepth = 18
  constructor() { }

  ngOnInit(): void {
  }

}
