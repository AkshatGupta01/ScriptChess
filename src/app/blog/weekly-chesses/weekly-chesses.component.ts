import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Page } from 'src/app/models/post';
import { PostAction, PostSelector } from 'src/app/rx/blogs';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { metaMap } from 'src/app/static-data/meta';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-weekly-chesses',
  templateUrl: './weekly-chesses.component.html',
  styleUrls: ['./weekly-chesses.component.scss']
})
export class WeeklyChessesComponent implements OnInit, OnDestroy {


  isLoading : boolean = true;
  ngUnsubscribe = new Subject<void>();
  weeklyChesses : Page[]
  constructor(private store : Store, private activatedRoute : ActivatedRoute, private meta : Meta,
    private titleService : Title, private analyticService : AnalyticsService) { 
   if(this.meta.getTag("description")) {
     this.meta.updateTag({'name': 'description', content: metaMap["Game of the week"].description})
   } else {
     this.meta.addTag({'name': 'description', content: metaMap["Game of the week"].description})
   }
   this.titleService.setTitle(metaMap["Game of the week"].title) 
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  ngOnInit(): void {
    this.analyticService.recordGameOfWeeksVisit();
    this.activatedRoute.queryParams.subscribe(params=> {
      if(params && params["page"]) {
        let page = Number.parseInt(params["page"]);
        let offset = page * environment.postsPerPage;
        this.store.dispatch(new PostAction.FetchWeeklyChesses(offset, environment.postsPerPage))
      } else {
        this.store.dispatch(new PostAction.FetchWeeklyChesses(0, environment.postsPerPage))
      }
      this.store.select(PostSelector.selectWeeklyChesses).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(posts=> {
        if(posts) {
          this.weeklyChesses = posts;
        }
      })

      this.store.select(PostSelector.selectIsLoading).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(loading=> {
        this.isLoading = loading;
      })
    })
  }

}
