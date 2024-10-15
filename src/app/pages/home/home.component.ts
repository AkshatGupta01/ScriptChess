import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Collection } from 'src/app/models/collections';
import { Post } from 'src/app/models/post';
import { Puzzle } from 'src/app/models/puzzle';
import { DatePipe } from 'src/app/pipes/date.pipe';
import { PostAction, PostSelector } from 'src/app/rx/blogs';
import { StudyAction, StudySelector } from 'src/app/rx/study';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';
import { metaMap } from 'src/app/static-data/meta';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  isLoading : boolean = true;
  ngUnsubscribe = new Subject<void>();
  posts : Post[] | undefined;
  specialMenuItems : Collection[] | undefined
  studies : Collection[] | undefined
  playersTournamentMenu : Collection[] | undefined
  beginnersMenu : Collection[] | undefined
  puzzleOfTheDay : Puzzle;
  puzzleCompleted: boolean = false;

  constructor(private store : Store, private service : ScriptChessServiceService, private meta : Meta, private title : Title, private analyticService : AnalyticsService) { 
    if(this.meta.getTag("description")) {
      this.meta.updateTag({'name': 'description', content: metaMap["Home"].description})
    } else {
      this.meta.addTag({'name': 'description', content: metaMap["Home"].description})
    }
    this.title.setTitle(metaMap["Home"].title)
  
    service.getCollections().pipe(takeUntil(this.ngUnsubscribe)).subscribe(collections=> {
      this.specialMenuItems= collections;
    })

    service.getBeginnersMenu().pipe(takeUntil(this.ngUnsubscribe)).subscribe(collections=> {
      this.beginnersMenu= collections;
    })

    service.getPlayersTournamentsMenu().pipe(takeUntil(this.ngUnsubscribe)).subscribe(collections=> {
      this.playersTournamentMenu = collections;
    })
    this.store.dispatch(new StudyAction.FetchStudies(0, 6));
    this.store.select(StudySelector.selectAllStudys).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(studies=> {
      if(studies && studies.length > 0) {
        studies.forEach(s=> {
          let imgUrl = "";
          if(s.image && s.image.length > 0 && s.image[0].formats && s.image[0].formats.small) {
            imgUrl = s.image[0].formats.small.url
          } else {
            imgUrl = s.image[0].previewUrl
          }
          let col : Collection = {
            title : s.name,
            imagePath : imgUrl,
            link:"/studies/" + s.slug
          }
          if(!this.studies)
            this.studies = []
          this.studies.push(col)
        })
        if(this.studies && this.studies.length > 5) {
          this.studies = this.studies.splice(0, 5);
          this.studies.push( {
            title : "All Studies",
            imagePath : "/assets/images/grid.png",
            link:"/studies/"
          })
        }
        
      }
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.store.dispatch(new PostAction.FetchPosts(0,6));
    this.store.select(PostSelector.selectAllPosts).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(posts=> {
      if(posts) {
        this.posts = posts;
      }
    });
    this.service.fetchTodaysPuzzle().subscribe(res=> {
      if(res && res.body) {
        this.puzzleOfTheDay = res.body;
      }
    })
  }

  onPuzzleComplete() {
    this.puzzleCompleted = true;
    let dp = new DatePipe();
    let date = dp.transform(new Date().toString())
    this.analyticService.recordDailyPuzzleSolved(date)
  }

}
