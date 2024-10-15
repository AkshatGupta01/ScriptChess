import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StaticBoardComponent } from 'src/app/common/static-board/static-board.component';
import { StudyComponent } from 'src/app/common/study/study.component';
import { Page, Post } from 'src/app/models/post';
import { PostAction, PostSelector } from 'src/app/rx/blogs';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { addSocialMediaMetaTags, buildHeadingTable, buildSchemaForBlog } from 'src/app/util/schema-builder';

@Component({
  selector: 'app-weekly-chess',
  templateUrl: './weekly-chess.component.html',
  styleUrls: ['./weekly-chess.component.scss']
})
export class WeeklyChessComponent implements OnInit , OnDestroy {

  isLoading : boolean = false;
  ngUnsubscribe = new Subject<void>();
  page : Page;
  schemaJson : string;
  pageBody : any | undefined;
  constructor(private activatedRoute : ActivatedRoute, private store : Store,
    private renderer2 : Renderer2, @Inject(DOCUMENT) private _document :any, 
    public sanitizer : DomSanitizer, private title : Title, private meta : Meta, private analyticService : AnalyticsService) { }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=> {
      if(params["slug"]) {
        let slug = params["slug"];
        this.store.dispatch(new PostAction.FetchWeeklyChess(slug));
        this.store.select(PostSelector.selectWeeklyChess).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(page=> {
          if(page) {
            this.analyticService.recordGameOfWeekVisit(page.title)
            let tmpPage = {...page};
            let body = tmpPage.content;
            body = body.split("[[sc").join("<div");
            body = body.split("]]").join(">");
            body = body.split("[[/sc").join("</div");
            body = body.split("<table>").join("<table style='border: none !important'>").split("<td>").join("<td style='border: none !important'>")
            body = body.split("https://scriptchess-images.s3.ap-south-1.amazonaws.com").join("https://d3eflz0swy1hif.cloudfront.net")
            let path = document.location.pathname
            body = buildHeadingTable(body, path);
            this.pageBody = this.sanitizer.bypassSecurityTrustHtml(body);

            setTimeout(()=>{
              //get all offers
              let allStaticBoard = document.getElementsByClassName('static-board')
              if(allStaticBoard.length > 0) {
                for(let i=0; i<allStaticBoard.length; i++) {
                  let element = allStaticBoard[i];
                  let cElement : NgElement & WithProperties<StaticBoardComponent> = document.createElement('static-board') as any;
                  let fenAttr = element.attributes.getNamedItem('fen')
                  if(fenAttr) {
                    cElement.fen = fenAttr.nodeValue;
                  }
                  element.append(cElement);
                }
              }
  
              let studyChess = document.getElementsByClassName('study-chess')
              if(studyChess.length > 0) {
                for(let i=0; i<studyChess.length; i++) {
                  let element = studyChess[i];
                  let cElement : NgElement & WithProperties<StudyComponent> = document.createElement('study-chess') as any;
                  let studyNameAttr = element.attributes.getNamedItem('studyname')
                  
                  if(studyNameAttr) {
                    cElement.studyName = studyNameAttr.nodeValue;
                  }
  
                  let authorNameAttr = element.attributes.getNamedItem('author')
                  
                  if(authorNameAttr) {
                    cElement.author = authorNameAttr.nodeValue;
                  }
  
                  let gamePgnAttr = element.attributes.getNamedItem('gamepgnstr')
                  
                  if(gamePgnAttr) {
                    cElement.gamepgnstr = gamePgnAttr.nodeValue;
                  }
  
  
  
                  element.append(cElement);
                }
              }
            })
          this.preparePage(page)
          }          
        })

        this.store.select(PostSelector.selectIsLoading).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(loading=> {
          this.isLoading = loading;         
        })
      }
    })
  }
  preparePage(page : Page) {
    this.page = page;
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
      image: this.page.media,
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
    addSocialMediaMetaTags(this.meta, page, document)
  }
}
