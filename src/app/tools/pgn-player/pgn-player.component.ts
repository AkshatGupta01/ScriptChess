import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-pgn-player',
  templateUrl: './pgn-player.component.html',
  styleUrls: ['./pgn-player.component.scss']
})
export class PgnPlayerComponent implements OnInit {


  constructor(private title : Title, private meta: Meta, private analyticService : AnalyticsService) { }

  ngOnInit(): void {
    let title = "Chess PGN Player | Script Chess"
    let meta =  "The scriptchess PGN player let you see the game described by the PGN using interactive chess board. It also shows the comments if the moves are annotated."
    this.title.setTitle(title)
    this.meta.updateTag({'name': 'description', content: meta})
    this.analyticService.recordPgnPlayerVisit();
  }

}
