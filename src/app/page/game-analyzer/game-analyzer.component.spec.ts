import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAnalyzerComponent } from './game-analyzer.component';

describe('GameAnalyzerComponent', () => {
  let component: GameAnalyzerComponent;
  let fixture: ComponentFixture<GameAnalyzerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameAnalyzerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameAnalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
