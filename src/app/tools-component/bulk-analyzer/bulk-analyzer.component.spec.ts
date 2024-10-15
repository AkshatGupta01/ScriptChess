import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkAnalyzerComponent } from './bulk-analyzer.component';

describe('BulkAnalyzerComponent', () => {
  let component: BulkAnalyzerComponent;
  let fixture: ComponentFixture<BulkAnalyzerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkAnalyzerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAnalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
