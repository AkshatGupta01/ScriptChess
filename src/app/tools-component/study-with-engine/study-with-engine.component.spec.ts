import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyWithEngineComponent } from './study-with-engine.component';

describe('StudyWithEngineComponent', () => {
  let component: StudyWithEngineComponent;
  let fixture: ComponentFixture<StudyWithEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudyWithEngineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyWithEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
