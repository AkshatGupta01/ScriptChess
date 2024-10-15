import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleSetTestComponent } from './puzzle-set-test.component';

describe('PuzzleSetTestComponent', () => {
  let component: PuzzleSetTestComponent;
  let fixture: ComponentFixture<PuzzleSetTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuzzleSetTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuzzleSetTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
