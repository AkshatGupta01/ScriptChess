import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardWithEngineComponent } from './board-with-engine.component';

describe('BoardWithEngineComponent', () => {
  let component: BoardWithEngineComponent;
  let fixture: ComponentFixture<BoardWithEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardWithEngineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardWithEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
