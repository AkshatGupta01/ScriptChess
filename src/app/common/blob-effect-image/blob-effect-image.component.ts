import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-blob-effect-image',
  templateUrl: './blob-effect-image.component.html',
  styleUrls: ['./blob-effect-image.component.scss']
})
export class BlobEffectImageComponent implements OnInit {


  @Input()
  imageAddress : string

  @Input()
  altText = ""

  @Input()
  height : number = 300

  @Input()
  width : number = 300

  constructor() { }

  ngOnInit(): void {
  }

}
