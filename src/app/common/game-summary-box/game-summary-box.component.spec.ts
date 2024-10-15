import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSummaryBoxComponent } from './game-summary-box.component';

describe('GameSummaryBoxComponent', () => {
  let component: GameSummaryBoxComponent;
  let fixture: ComponentFixture<GameSummaryBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameSummaryBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSummaryBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
