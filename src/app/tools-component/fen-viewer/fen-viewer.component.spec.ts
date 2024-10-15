import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FenViewerComponent } from './fen-viewer.component';

describe('FenViewerComponent', () => {
  let component: FenViewerComponent;
  let fixture: ComponentFixture<FenViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FenViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FenViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
