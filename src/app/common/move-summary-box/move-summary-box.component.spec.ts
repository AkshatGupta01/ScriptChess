import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveSummaryBoxComponent } from './move-summary-box.component';

describe('MoveSummaryBoxComponent', () => {
  let component: MoveSummaryBoxComponent;
  let fixture: ComponentFixture<MoveSummaryBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveSummaryBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveSummaryBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
