import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Game } from 'src/app/models/game';

@Component({
  selector: 'app-game-label',
  templateUrl: './game-label.component.html',
  styleUrls: ['./game-label.component.scss']
})
export class GameLabelComponent implements OnInit {

  @Input()
  game : Game | undefined;
  
  @Input() 
  index : number | undefined

  className : string = ""
  constructor() { }



  ngOnInit(): void {
    if(this.index) {
      this.index = this.index+1;
    } else {
      this.index = 1;
    }
    if(this.index && this.index %2 == 0) {
      this.className = "even"
    } else {
      this.className = "odd"
    }
  }

}
