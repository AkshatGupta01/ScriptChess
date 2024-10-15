import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-noob-computer-player',
  templateUrl: './noob-computer-player.component.html',
  styleUrls: ['./noob-computer-player.component.scss']
})
export class NoobComputerPlayerComponent implements OnInit {

  constructor(private analyticService : AnalyticsService) { }

  ngOnInit(): void {
    this.analyticService.recordNoobPlayer()
  }

}
