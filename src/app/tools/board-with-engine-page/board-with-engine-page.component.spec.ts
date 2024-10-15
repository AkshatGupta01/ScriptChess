import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardWithEnginePageComponent } from './board-with-engine-page.component';

describe('BoardWithEnginePageComponent', () => {
  let component: BoardWithEnginePageComponent;
  let fixture: ComponentFixture<BoardWithEnginePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardWithEnginePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardWithEnginePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
