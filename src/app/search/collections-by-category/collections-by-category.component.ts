import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameCollection } from 'src/app/models/game-collection';
import { GameCollectionAction, GameCollectionSelector } from 'src/app/rx/collections';
import { collectionCategoryDesc } from 'src/app/static-data/collection-categories-desc';

@Component({
  selector: 'app-collections-by-category',
  templateUrl: './collections-by-category.component.html',
  styleUrls: ['./collections-by-category.component.scss']
})
export class CollectionsByCategoryComponent implements OnInit, OnDestroy {

  ngUnsubscribe = new Subject<void>();
  title : string
  description : string
  collections : GameCollection[]
  loading  :boolean = false;
  
  constructor(private store : Store, private activatedRoute : ActivatedRoute, private snackBar : MatSnackBar, private meta : Meta, private titleService : Title) { 
    
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=> {
      if(params["category"]) {
        let category : string = params["category"];
        category = category.toUpperCase();
        let desc = collectionCategoryDesc[category];
        if(desc) {
          this.title = desc["title"]
          this.description = desc["description"]
          if(this.meta.getTag("description")) {
            this.meta.updateTag({'name': 'description', content: this.description})
          } else {
            this.meta.addTag({'name': 'description', content: this.description})
          }
          this.titleService.setTitle(this.title + " | Scriptchess")
        }
        this.store.dispatch(new GameCollectionAction.FetchGameCollectionsWithCategory(0, 100, category));
        this.store.select(GameCollectionSelector.selectAllGameCollections).pipe(takeUntil(this.ngUnsubscribe)).subscribe(collections=> {
          if(collections) {
            this.collections = collections;
          }
        });

        this.store.select(GameCollectionSelector.selectIsLoading).pipe(takeUntil(this.ngUnsubscribe)).subscribe(loading=> {
          this.loading = loading;
        });

        this.store.select(GameCollectionSelector.selectError).pipe(takeUntil(this.ngUnsubscribe)).subscribe(erorr=> {
          if(erorr) {
            this.snackBar.open("We have fell into some unexpected scinario. Please try later.", "close")
          }
        });
      }
    })
  }

}
