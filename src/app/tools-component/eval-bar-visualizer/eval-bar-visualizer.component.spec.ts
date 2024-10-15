import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvalBarVisualizerComponent } from './eval-bar-visualizer.component';

describe('EvalBarVisualizerComponent', () => {
  let component: EvalBarVisualizerComponent;
  let fixture: ComponentFixture<EvalBarVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvalBarVisualizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvalBarVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
