import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyChessCardComponent } from './weekly-chess-card.component';

describe('WeeklyChessCardComponent', () => {
  let component: WeeklyChessCardComponent;
  let fixture: ComponentFixture<WeeklyChessCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyChessCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyChessCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
