import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Post } from 'src/app/models/post';
import { PostAction, PostSelector } from 'src/app/rx/blogs';
import { metaMap } from 'src/app/static-data/meta';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit, OnDestroy {


  isLoading : boolean = true;
  ngUnsubscribe = new Subject<void>();
  posts : Post[]
  constructor(private store : Store, private activatedRoute : ActivatedRoute, private meta : Meta, private title : Title) { 
    if(this.meta.getTag("description")) {
      this.meta.updateTag({'name': 'description', content: metaMap["Blogs"].description})
    } else {
      this.meta.addTag({'name': 'description', content: metaMap["Blogs"].description})
    }
    this.title.setTitle(metaMap["Blogs"].title)
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params=> {
      if(params && params["page"]) {
        let page = Number.parseInt(params["page"]);
        let offset = page * environment.postsPerPage;
        this.store.dispatch(new PostAction.FetchPosts(offset, environment.postsPerPage))
      } else {
        this.store.dispatch(new PostAction.FetchPosts(0, environment.postsPerPage))
      }
      this.store.select(PostSelector.selectAllPosts).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(posts=> {
        if(posts) {
          this.posts = posts;
        }
      })

      this.store.select(PostSelector.selectIsLoading).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(loading=> {
        this.isLoading = loading;
      })
    })
    
  }

}
