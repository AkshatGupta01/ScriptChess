import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Faq } from 'src/app/models/post';

@Component({
  selector: 'app-faq-items',
  templateUrl: './faq-items.component.html',
  styleUrls: ['./faq-items.component.scss']
})
export class FaqItemsComponent implements OnInit {

  @Input()
  faq : Faq;
  tmpFaq : any;
  constructor(public sanitizer : DomSanitizer) { }

  ngOnInit(): void {
    
    if(this.faq && this.faq.answer) {
      this.tmpFaq = {
        ...this.faq
      }
      this.tmpFaq.answer = this.tmpFaq.answer.split("https://scriptchess-images.s3.ap-south-1.amazonaws.com").join("https://d3eflz0swy1hif.cloudfront.net")
    }
  }

}
