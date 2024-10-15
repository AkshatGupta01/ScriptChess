import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AnalyticsService } from './services/analytics.service';
import { Meta } from '@angular/platform-browser';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ScriptChessServiceService } from './services/script-chess-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'script-chess';
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private analyticService  :AnalyticsService,
   private meta : Meta, private router : Router, private service : ScriptChessServiceService) {
      this.router.events.subscribe((event : Event)=>{
        if (event instanceof NavigationEnd) {
          service.recordAnalytics(event.url)
        }
      })

      let color = localStorage.getItem("darkSquareColor")
      document.documentElement.style.setProperty('--darkSquareColor', color);
      let radius = localStorage.getItem("squareRadius")
      document.documentElement.style.setProperty('--squareRadius', radius);
  }
  onActivate(event : any) {
    if(isPlatformBrowser(this.platformId))
      window.scroll(0,0);
    let location = window.location;
    let pathname = "";
    let url = location.href;
    url = url.replace("www.","");
    if(this.meta.getTag("name=canonical"))
      this.meta.updateTag({"name":"canonical","content":url})
    else
      this.meta.addTag({"name":"canonical","content":url})

  }

  ngAfterViewInit() {
    this.analyticService.loadScript();
  }
}
