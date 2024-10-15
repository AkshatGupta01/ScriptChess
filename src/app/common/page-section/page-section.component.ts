import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Page, Post } from 'src/app/models/post';
import { SlugifyPipe } from 'src/app/pipes/slugify.pipe';
import { PostAction, PostSelector } from 'src/app/rx/blogs';
import { buildHeadingTable, buildSchemaForBlog } from 'src/app/util/schema-builder';
import { PuzzleSetComponent } from '../puzzle-set/puzzle-set.component';
import { StaticBoardComponent } from '../static-board/static-board.component';
import { StudyComponent } from '../study/study.component';

@Component({
  selector: 'app-page-section',
  templateUrl: './page-section.component.html',
  styleUrls: ['./page-section.component.scss']
})
export class PageSectionComponent implements OnInit , OnDestroy {

  @Input()
  pageSlug : string

  @Input()
  buildNavigation : boolean = true;
  isLoading = false;
  page : Page = null
  ngUnsubscribe = new Subject<void>();
  schemaJson: any;
  content : string
  pageBody : any | undefined;
  slugyFi : SlugifyPipe = new SlugifyPipe();
  constructor(private store : Store,
    private renderer2 : Renderer2, @Inject(DOCUMENT) private _document :any,
    public sanitizer : DomSanitizer, private title : Title, private meta : Meta, private router : ActivatedRoute) { }


  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    if(!this.pageSlug)
      return
    this.store.dispatch(new PostAction.FetchPage(this.pageSlug));
    this.store.select(PostSelector.selectPage).pipe(takeUntil(this.ngUnsubscribe)).subscribe(page=> {
      if(page) {
        if(page["length"] == 0)
          return
        if(page.slug.toLocaleLowerCase() != this.pageSlug.toLocaleLowerCase())
          return
        this.preparePage(page)
        this.inflateWebElements()
      }
    })
  }

  inflateWebElements() {
    let path = document.location.pathname
    let tmpPage = {...this.page};
    let body = tmpPage.content;
    body = body.split("[[sc").join("<div");
    body = body.split("]]").join(">");
    body = body.split("[[/sc").join("</div");
    body = body.split("<table>").join("<table style='border: none !important'>").split("<td>").join("<td style='border: none !important'>")
    body = body.split("https://scriptchess-images.s3.ap-south-1.amazonaws.com").join("https://d3eflz0swy1hif.cloudfront.net")
    body = body.split("<img").join("<img style=width:100%")
    let allStaticBoard = document.getElementsByClassName('static-board')
    if(this.buildNavigation)
      body = buildHeadingTable(body, path);
    this.pageBody = this.sanitizer.bypassSecurityTrustHtml(body);
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

  preparePage(page) {
    this.page = page;
    this.content = this.page.content.split("<table>").join("<table style='border: none !important'>").split("<td>").join("<td style='border: none !important'>")
    this.content = this.content.split("https://scriptchess-images.s3.ap-south-1.amazonaws.com").join("https://d3eflz0swy1hif.cloudfront.net")
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
      this.meta.updateTag({name:"keywords",content: tags})
      this.meta.updateTag({name:"date",content: this.page.published_at})
      if(this.page.writer) {
        this.meta.updateTag({name:"author",content: this.page.writer.name})
        this.meta.updateTag({name:"copyright",content: this.page.writer.name})
      }
    }
  }
}
