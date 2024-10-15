import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-fen-loader',
  templateUrl: './fen-loader.component.html',
  styleUrls: ['./fen-loader.component.scss']
})
export class FenLoaderComponent implements OnInit {

  constructor(private analyticService : AnalyticsService) { }

  ngOnInit(): void {
    this.analyticService.recordFenPlayerVisit();
  }

}
