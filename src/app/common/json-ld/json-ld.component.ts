import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-json-ld',
  templateUrl: './json-ld.component.html',
  styleUrls: ['./json-ld.component.scss']
})
export class JsonLdComponent implements OnInit {

  @Input()
  schemaJson : string;
  schema: SafeHtml;
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {    
    if(this.schemaJson) {
      this.schema = JSON.parse(this.schemaJson);
    }
      
  }

  getSafeHTML(jsonString : string) {
    return this.sanitizer.bypassSecurityTrustHtml(jsonString);
  }

}
