import { Component, Input, OnInit } from '@angular/core';
import { GameCollection } from 'src/app/models/game-collection';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-mini-collection-box',
  templateUrl: './mini-collection-box.component.html',
  styleUrls: ['./mini-collection-box.component.scss']
})
export class MiniCollectionBoxComponent implements OnInit {

  @Input()
  collection : GameCollection
  constructor(private analyticService : AnalyticsService) { }

  ngOnInit(): void {
  }

  recordCollectionClick(collection : GameCollection) {
    this.analyticService.recordCollectionClick(collection, "collection-by-category")
  }
}
