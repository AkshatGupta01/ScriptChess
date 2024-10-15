import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingStartButtonComponent } from './training-start-button.component';

describe('TrainingStartButtonComponent', () => {
  let component: TrainingStartButtonComponent;
  let fixture: ComponentFixture<TrainingStartButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingStartButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingStartButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
