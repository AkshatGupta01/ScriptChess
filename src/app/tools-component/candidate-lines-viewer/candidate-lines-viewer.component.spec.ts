import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateLinesViewerComponent } from './candidate-lines-viewer.component';

describe('CandidateLinesViewerComponent', () => {
  let component: CandidateLinesViewerComponent;
  let fixture: ComponentFixture<CandidateLinesViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateLinesViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateLinesViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
