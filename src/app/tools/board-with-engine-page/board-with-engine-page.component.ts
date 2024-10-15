import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board-with-engine-page',
  templateUrl: './board-with-engine-page.component.html',
  styleUrls: ['./board-with-engine-page.component.scss']
})
export class BoardWithEnginePageComponent implements OnInit {

  allowSetPosition : boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
}
