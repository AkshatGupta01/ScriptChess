import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { generateRandomID } from 'src/app/util/strings';

@Component({
  selector: 'app-fen-viewer',
  templateUrl: './fen-viewer.component.html',
  styleUrls: ['./fen-viewer.component.scss']
})
export class FenViewerComponent implements OnInit {

  @Input()
  fen : string
  currentFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  boardId : string
  constructor(private router : Router, private analyticService : AnalyticsService) { 
    this.boardId = generateRandomID(5).trim();;
  }

  ngOnInit(): void {
    if(this.fen) {
      this.currentFen = this.fen
    }
  }

  onFenEnter(fen : string) {
    this.currentFen = fen
    this.analyticService.recordFenPlayerUsed();
  }

  searchFen() {

  }
}
