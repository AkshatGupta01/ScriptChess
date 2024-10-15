import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionQuizComponent } from './position-quiz.component';

describe('PositionQuizComponent', () => {
  let component: PositionQuizComponent;
  let fixture: ComponentFixture<PositionQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionQuizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
