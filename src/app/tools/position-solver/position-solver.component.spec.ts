import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionSolverComponent } from './position-solver.component';

describe('PositionSolverComponent', () => {
  let component: PositionSolverComponent;
  let fixture: ComponentFixture<PositionSolverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionSolverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionSolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
