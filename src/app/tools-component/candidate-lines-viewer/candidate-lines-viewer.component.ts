import { Component, Input, OnInit } from '@angular/core';
import { PrimaryLine, PrimaryLines } from 'src/app/models/move';

@Component({
  selector: 'app-candidate-lines-viewer',
  templateUrl: './candidate-lines-viewer.component.html',
  styleUrls: ['./candidate-lines-viewer.component.scss']
})
export class CandidateLinesViewerComponent implements OnInit {

  @Input()
  primaryLines : PrimaryLines;

  @Input()
  lines : PrimaryLine[]

  @Input()
  maxLines : number = 3;
  constructor() { }

  ngOnInit(): void {
    if(this.primaryLines) {
      this.lines = this.primaryLines.getLines().reverse();
    }

  }

  ngOnChanges()	{
    if(this.primaryLines) {
      this.lines = this.primaryLines.getLines().reverse();
    }
    if(this.lines && this.maxLines < this.lines.length) {
      this.lines = this.lines.splice(0, this.lines.length - this.maxLines)
    }

  }

}
