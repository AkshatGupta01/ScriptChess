import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

declare interface Window {
  adsbygoogle: any[];
}
declare var adsbygoogle: any[];

@Component({
  selector: 'app-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss']
})
export class AdComponent implements OnInit {

  clientId : string
  constructor() {
    this.clientId = environment.googleAdClientId;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      try {
        (window["adsbygoogle"] = window["adsbygoogle"] || []).push({});
      } catch (e) {
        console.error("ads", e);
      }
    }, 900);
  }

}
