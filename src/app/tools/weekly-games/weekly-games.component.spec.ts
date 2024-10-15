import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyGamesComponent } from './weekly-games.component';

describe('WeeklyGamesComponent', () => {
  let component: WeeklyGamesComponent;
  let fixture: ComponentFixture<WeeklyGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyGamesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
