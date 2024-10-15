import { Component, Input, OnInit } from '@angular/core';
import { Menu } from 'src/app/models/menu';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-menu-card',
  templateUrl: './menu-card.component.html',
  styleUrls: ['./menu-card.component.scss']
})
export class MenuCardComponent implements OnInit {

  @Input()
  menu : Menu | undefined
  constructor(private analyticService : AnalyticsService) { }

  ngOnInit(): void {
  }

  recordMenuCardClicked() {
    this.analyticService.recordMenuCardClicked(this.menu.title);
  }

}
