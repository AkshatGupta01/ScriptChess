import { isGeneratedFile } from '@angular/compiler/src/aot/util';
import { Component, Input, OnInit } from '@angular/core';
import { generateRandomID } from 'src/app/util/strings';

@Component({
  selector: 'app-static-board',
  templateUrl: './static-board.component.html',
  styleUrls: ['./static-board.component.scss']
})
export class StaticBoardComponent implements OnInit {

  public _fen!: string | null;
  boardId : string | undefined;

  @Input()
  get fen() {
    if(!this._fen)
      return "";
    else
    return this._fen
  } 

  set fen(_fen : string | null) {
    this._fen = _fen;
  }

  @Input()
  width : string

  constructor() { 
    this.boardId = generateRandomID(5).trim();
  }

  ngOnInit(): void {
    if(!this.width) {
      this.width = "250px";
    }
  }

}
