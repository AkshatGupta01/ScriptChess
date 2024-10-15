import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyLineComponent } from './study-line.component';

describe('StudyLineComponent', () => {
  let component: StudyLineComponent;
  let fixture: ComponentFixture<StudyLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudyLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
