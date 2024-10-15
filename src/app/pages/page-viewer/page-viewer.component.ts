import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Page, Post } from 'src/app/models/post';
import { PostAction, PostSelector } from 'src/app/rx/blogs';
import { buildHeadingTable, buildSchemaForBlog } from 'src/app/util/schema-builder';

@Component({
  selector: 'app-page-viewer',
  templateUrl: './page-viewer.component.html',
  styleUrls: ['./page-viewer.component.scss']
})
export class PageViewerComponent implements OnInit , OnDestroy {

  isLoading : boolean = false;
  ngUnsubscribe = new Subject<void>();
  page : Page;
  schemaJson : string;
  content : string;
  pageBody : any;
  constructor(private activatedRoute : ActivatedRoute, private store : Store,
    private renderer2 : Renderer2, @Inject(DOCUMENT) private _document :any, 
    public sanitizer : DomSanitizer, private title : Title, private meta : Meta) { }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=> {
      if(params["slug"]) {
        let slug = params["slug"];
        this.store.dispatch(new PostAction.FetchPage(slug));
        this.store.select(PostSelector.selectPage).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(page=> {
          if(page) {
            this.page = page;
            let path = document.location.pathname
            this.content = this.page.content.split("<table>").join("<table style='border: none !important'>").split("<td>").join("<td style='border: none !important'>")
            this.content = this.content.split("https://scriptchess-images.s3.ap-south-1.amazonaws.com").join("https://d3eflz0swy1hif.cloudfront.net")
            this.content = buildHeadingTable(this.content, path);
            this.pageBody = this.sanitizer.bypassSecurityTrustHtml(this.content);
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
        })

        this.store.select(PostSelector.selectIsLoading).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(loading=> {
          this.isLoading = loading;         
        })
      }
    })
  }

}
