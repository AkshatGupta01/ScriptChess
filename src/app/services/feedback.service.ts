import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { FeedbackAction } from '../rx/feedback';
import { HtmlUtilities } from '../util/html-utilities';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  htmlUtilities : HtmlUtilities
  constructor(@Inject(DOCUMENT) private _document : any) {
    this.htmlUtilities = new HtmlUtilities()
  }

  popupFeedback(page : string, store: Store) {
    let val = localStorage.getItem("feedback-" + page)
    if(val != "true") {
      store.dispatch(new FeedbackAction.LaunchFeedbackForm());
    }
  }
}
