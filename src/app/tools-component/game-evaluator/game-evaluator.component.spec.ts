import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEvaluatorComponent } from './game-evaluator.component';

describe('GameEvaluatorComponent', () => {
  let component: GameEvaluatorComponent;
  let fixture: ComponentFixture<GameEvaluatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameEvaluatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameEvaluatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
