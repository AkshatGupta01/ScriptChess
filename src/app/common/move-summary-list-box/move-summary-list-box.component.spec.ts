import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveSummaryListBoxComponent } from './move-summary-list-box.component';

describe('MoveSummaryListBoxComponent', () => {
  let component: MoveSummaryListBoxComponent;
  let fixture: ComponentFixture<MoveSummaryListBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveSummaryListBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveSummaryListBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
