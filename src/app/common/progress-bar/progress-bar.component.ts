import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  color: ThemePalette = 'accent';
  mode: ProgressBarMode = 'determinate';

  @Input()
  value = 0;
  constructor() { }

  ngOnInit(): void {

  }

}
