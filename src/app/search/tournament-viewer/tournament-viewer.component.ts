import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Game } from 'src/app/models/game';
import { GameSearchParams } from 'src/app/models/game-search-params';
import { Page, Post } from 'src/app/models/post';
import { Tournament } from 'src/app/models/tournament';
import { PostAction, PostSelector } from 'src/app/rx/blogs';
import { GameAction, GameSelector } from 'src/app/rx/games';
import { TournamentAction, TournamentSelector } from 'src/app/rx/tournaments';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { metaMap } from 'src/app/static-data/meta';
import { buildSchemaForBlog } from 'src/app/util/schema-builder';

@Component({
  selector: 'app-tournament-viewer',
  templateUrl: './tournament-viewer.component.html',
  styleUrls: ['./tournament-viewer.component.scss']
})
export class TournamentViewerComponent implements OnInit, OnDestroy {
  games : Game[];
  tournament : Tournament
  isLoading : boolean = true;
  ngUnsubscribe = new Subject<void>();
  schemaJson : string;
  page : Page
  content : string 
  tournamentSlug : string
  dataSource : MatTableDataSource<Game> = new MatTableDataSource([]);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayEcoPerPage : number = 20;
  displayedColumns : string[] = ["whitePlayer","blackPlayer", "year", "eco", "tournament", "result","moveCount","categories", "sacrifices","gameLink" ]
  constructor(private store : Store, private activatedRoute : ActivatedRoute, private meta : Meta, private title : Title, 
    private analyticService : AnalyticsService, public sanitizer : DomSanitizer ) { }
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=> {
      let name = params["tournamentName"]
      let id = params["tournamentId"]
      let year = params["year"]
      this.setTitleAndMeta(name, year)
      this.store.dispatch(new TournamentAction.FetchTournament(id))
      let gameSearchParams : GameSearchParams = {
        tournament : name,
        year: year
      }
      this.store.dispatch(new TournamentAction.FetchTournament(id))
      this.store.dispatch(new GameAction.SearchGames(gameSearchParams, 0, 1000))
      this.store.select(TournamentSelector.selectCurrentTournament).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(t=> {
        if(t) {
          this.tournament = t;
          if(this.tournament.slug) {
            this.tournamentSlug = this.tournament.slug
            // this.store.dispatch(new PostAction.FetchPage(this.tournament.slug));
            // this.store.select(PostSelector.selectPage).pipe(takeUntil(this.ngUnsubscribe)).subscribe(page=> {
            //   //this.createPageObject(page)
            //   if(page)
            //     ;
            // })
          }
        }
      })
      
      

    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.activatedRoute.params.subscribe(params=> {
      let year = params["year"]
      this.store.select(GameSelector.selectAllGames).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((games : Game[])=> {
        if(games) {
          this.games = []
          games.forEach((g : Game)=> {
            if(g.date) {
              g.date.getFullYear == year
              this.games.push(g)
              let tmpGames = this.games.slice(0, this.displayEcoPerPage);
              this.dataSource = new MatTableDataSource(tmpGames);
              // this.dataSource.paginator = this.paginator;
              // this.dataSource.sort = this.sort;
              this.dataSource._updateChangeSubscription();
            }
          })
        }
      })
    })
    
  }

  setTitleAndMeta(name : string, year : string) {
    if(this.meta.getTag("description")) {
      this.meta.updateTag({'name': 'description', content: metaMap["Tournament"].description.replace("{1}", name).replace("{2}", year)})
    } else {
      this.meta.addTag({'name': 'description', content: metaMap["Tournament"].description.replace("{1}", name).replace("{2}", year)})
    }
    this.title.setTitle(metaMap["Tournament"].title.replace("{1}", name).replace("{2}", year)) 
  }

  recordGameClick(game : any) {
    this.analyticService.recordGameClick(game, "Collection-viewer")
  }

  createPageObject(page : Page) {
    if(!page)
      return;
    if(page["length"] == 0)
      return
    this.page = page;
    
    //this.content = this.page.content.split("<table>").join("<table style='border: none !important'>").split("<td>").join("<td style='border: none !important'>")
    this.content = this.page.content.split("https://scriptchess-images.s3.ap-south-1.amazonaws.com").join("https://d3eflz0swy1hif.cloudfront.net")
    let post : Post = {
      id: this.page.id,
      title: this.page.title,
      description: this.page.seo ? "" : this.page.seo.metaDescription,
      content: this.page.content,
      slug: this.page.slug,
      author: this.page.writer,
      published_at: this.page.published_at,
      created_at: this.page.created_at,
      updated_at: this.page.updated_at,
      image: this.page.image,
      faq : this.page.faq,
      seo : this.page.seo,
      tags : this.page.tags,
    } 
    this.schemaJson = buildSchemaForBlog(post);
    if(page.seo && page.seo.metaTitle)
      this.title.setTitle(page.seo.metaTitle + "| Scriptchess")
    else   
      this.title.setTitle(page.title  + "| Scriptchess")
    if(page.seo && page.seo.metaDescription)
      this.meta.updateTag({name:"description",content: page.seo.metaDescription})
    if(page.tags && page.tags.length > 0) {
      let tags = "";
      page.tags.forEach(tag=> {
        tags = tags + "," + tag.name;
      })
      tags = tags.substring(1, tags.length);
      this.meta.updateTag({name:"keyword",content: tags})
    }
  }

  handlePageEvent(e:PageEvent) {
    let tmpGames = this.games.slice(e.pageIndex * e.pageSize, (e.pageIndex + 1) * e.pageSize)
          
    this.dataSource = new MatTableDataSource(tmpGames);
  }
}
