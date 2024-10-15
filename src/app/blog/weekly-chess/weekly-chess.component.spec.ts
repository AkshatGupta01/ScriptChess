import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyChessComponent } from './weekly-chess.component';

describe('WeeklyChessComponent', () => {
  let component: WeeklyChessComponent;
  let fixture: ComponentFixture<WeeklyChessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyChessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyChessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
