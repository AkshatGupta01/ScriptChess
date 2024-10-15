import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkAnalyzerPageComponent } from './bulk-analyzer-page.component';

describe('BulkAnalyzerPageComponent', () => {
  let component: BulkAnalyzerPageComponent;
  let fixture: ComponentFixture<BulkAnalyzerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkAnalyzerPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAnalyzerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
