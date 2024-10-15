import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Banner } from 'src/app/models/banner';
import { PostAction, PostSelector } from 'src/app/rx/blogs';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { HtmlUtilities } from 'src/app/util/html-utilities';

@Component({
  selector: 'app-banner-slider',
  templateUrl: './banner-slider.component.html',
  styleUrls: ['./banner-slider.component.scss']
})
export class BannerSliderComponent implements OnInit , OnDestroy {

  
  banners : Banner[] | undefined
  isLoading : boolean = true;
  ngUnsubscribe = new Subject<void>();
  htmlUtilities : HtmlUtilities
  noBanner = false;
  constructor(private renderer2 : Renderer2, @Inject(DOCUMENT) private _document : any, 
  public sanitizer : DomSanitizer, private store : Store, private analyticService : AnalyticsService) { 
    this.htmlUtilities = new HtmlUtilities();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.store.dispatch(new PostAction.FetchBanners());
    this.store.select(PostSelector.selectBanners).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(banners=> {
      if(banners && banners.length > 0) {
        this.banners = banners;
        this.htmlUtilities.addWrapperJsScript(this.renderer2, this._document, "/assets/js/banner.js");
      } else {
        if(banners && banners.length == 0) {
          this.noBanner = true;
        }
      }
    });

    this.store.select(PostSelector.selectIsLoading).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(loading=> {
      this.isLoading = loading
    });
  }

  recordBannerEvent(banner : Banner, index : number) {    
    this.analyticService.recordBannerClick(banner.title, (index+1))
    if(banner.link.startsWith("http") && banner.link.indexOf("https://scriptchess.com") < 0) {
      this.analyticService.recordOutboundClick(banner.link, "Banner");
    }
  }

}
