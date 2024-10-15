import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  loggedIn = false;
  constructor(private analyticService : AnalyticsService) {
    let auth = localStorage.getItem("auth")
    if(auth) {
      this.loggedIn = true;
    }
  }

  ngOnInit(): void {

  }

  recordLogoClicked() {
    this.analyticService.recordLogoClicked(window.location.href);
  }

  recordMenuClicked(link : string) {
    this.analyticService.recordMenuClicked(link)
  }

  signOut() {
    localStorage.removeItem("auth")
    localStorage.removeItem("auth.user")
    this.loggedIn = false;
    localStorage.removeItem("trainingStarted")
    localStorage.removeItem("trainingStartedOn")
    localStorage.removeItem("trainingReport")
  }

}
