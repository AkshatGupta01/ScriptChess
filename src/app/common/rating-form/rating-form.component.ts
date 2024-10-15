import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-rating-form',
  templateUrl: './rating-form.component.html',
  styleUrls: ['./rating-form.component.scss']
})
export class RatingFormComponent implements OnInit {

  @Output()
  ratingClicked = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onRatingClicked(value) {
    this.ratingClicked.emit(value)
  }
}
