import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionQuizPageComponent } from './position-quiz-page.component';

describe('PositionQuizPageComponent', () => {
  let component: PositionQuizPageComponent;
  let fixture: ComponentFixture<PositionQuizPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionQuizPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionQuizPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
