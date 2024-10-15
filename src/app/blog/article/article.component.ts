import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PuzzleSetComponent } from 'src/app/common/puzzle-set/puzzle-set.component';
import { StaticBoardComponent } from 'src/app/common/static-board/static-board.component';
import { StudyComponent } from 'src/app/common/study/study.component';
import { Post } from 'src/app/models/post';
import { DatePipe } from 'src/app/pipes/date.pipe';
import { PostAction, PostSelector } from 'src/app/rx/blogs';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { addSocialMediaMetaTags, buildHeadingTable, buildSchemaForBlog } from 'src/app/util/schema-builder';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit , OnDestroy {

  article : Post
  isLoading = true; 
  schemaJson : string;
  ngUnsubscribe = new Subject<void>();
  content : string;
  pageBody: any;
  slug : string
  constructor(private store : Store<any>, private router : ActivatedRoute, 
    private renderer2 : Renderer2, @Inject(DOCUMENT) private _document :any, public sanitizer : DomSanitizer
    , private route : RouterModule, private titleService : Title, private metaService : Meta, private analyticService : AnalyticsService) { }

  ngOnInit(): void {
    this.router.params.subscribe(params=> {
      if(params["slug"]) {
        this.slug = params["slug"];
        this.store.dispatch(new PostAction.FetchPost(params["slug"]))
        this.store.select(PostSelector.selectCurrentPost).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(currentPost=> {
          if(currentPost) {
            this.article = currentPost;
            this.content = this.article.content;
            this.content = this.content.split("https://scriptchess-images.s3.ap-south-1.amazonaws.com").join("https://d3eflz0swy1hif.cloudfront.net")
            this.schemaJson = buildSchemaForBlog(currentPost);            
            if(currentPost.seo && currentPost.seo.metaTitle)
              this.titleService.setTitle(currentPost.seo.metaTitle + "| Scriptchess")
            else   
              this.titleService.setTitle(currentPost.title  + "| Scriptchess")
            if(currentPost.seo && currentPost.seo.metaDescription)
              this.metaService.updateTag({name:"description",content: currentPost.seo.metaDescription})
            if(currentPost.tags && currentPost.tags.length > 0) {
              let tags = "";
              currentPost.tags.forEach(tag=> {
                tags = tags + "," + tag.name;
              })
              tags = tags.substring(1, tags.length);
              this.metaService.updateTag({name:"keyword",content: tags})
              this.metaService.updateTag({name:"date",content: this.article.published_at})
              if(this.article.author) {
                this.metaService.updateTag({name:"author",content: this.article.author.name})
                this.metaService.updateTag({name:"copyright",content: this.article.author.name})
              }
              
              addSocialMediaMetaTags(this.metaService, this.article, document)
            }
            this.analyticService.recordBlogRead(currentPost);
            this.inflateWebElements()
          }
            
        })
        this.store.select(PostSelector.selectIsLoading).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(isLoading=> {
          this.isLoading = isLoading;
        })

        
      }
    })
    
  }

  inflateWebElements() {
    let tmpPage = {...this.article};
    let body = tmpPage.content;
    body = body.split("[[sc").join("<div");
    body = body.split("]]").join(">");
    body = body.split("[[/sc").join("</div");
    body = body.split("<table>").join("<table style='border: none !important'>").split("<td>").join("<td style='border: none !important'>")
    body = body.split("https://scriptchess-images.s3.ap-south-1.amazonaws.com").join("https://d3eflz0swy1hif.cloudfront.net")
    this.content = body;
    let path = document.location.pathname
    this.content = buildHeadingTable(this.content, path);
    this.pageBody = this.sanitizer.bypassSecurityTrustHtml(this.content);
    let allStaticBoard = document.getElementsByClassName('static-board')
    setTimeout(()=> {
      
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

      let puzzleSets = document.getElementsByClassName('puzzle-set')
      if(puzzleSets.length > 0) {
        for(let i=0; i<puzzleSets.length; i++) {
          let element = puzzleSets[i];
          let cElement : NgElement & WithProperties<PuzzleSetComponent> = document.createElement('puzzle-set') as any;
          let puzzleTitle = element.attributes.getNamedItem('title')
          let puzzleSet = element.attributes.getNamedItem('puzzleSet')
          
          if(puzzleTitle) {
            cElement.title = puzzleTitle.nodeValue;
          }
          if(puzzleSet) {
            cElement.puzzleSet = puzzleSet.nodeValue;
          }
          element.append(cElement);
        }
      }
      
      if(this.router.snapshot.fragment) {
        let fragment = this.router.snapshot.fragment;
        let element = document.getElementById(fragment);
        window.scrollTo({
          top : element.offsetTop
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}

