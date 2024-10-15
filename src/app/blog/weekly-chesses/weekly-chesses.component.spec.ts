import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyChessesComponent } from './weekly-chesses.component';

describe('WeeklyChessesComponent', () => {
  let component: WeeklyChessesComponent;
  let fixture: ComponentFixture<WeeklyChessesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyChessesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyChessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
