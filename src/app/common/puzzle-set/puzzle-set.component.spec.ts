import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleSetComponent } from './puzzle-set.component';

describe('PuzzleSetComponent', () => {
  let component: PuzzleSetComponent;
  let fixture: ComponentFixture<PuzzleSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuzzleSetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuzzleSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
