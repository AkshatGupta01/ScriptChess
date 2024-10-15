import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleAttemptViewComponent } from './puzzle-attempt-view.component';

describe('PuzzleAttemptViewComponent', () => {
  let component: PuzzleAttemptViewComponent;
  let fixture: ComponentFixture<PuzzleAttemptViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuzzleAttemptViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuzzleAttemptViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
