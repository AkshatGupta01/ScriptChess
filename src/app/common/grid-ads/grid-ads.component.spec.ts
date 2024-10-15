import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridAdsComponent } from './grid-ads.component';

describe('GridAdsComponent', () => {
  let component: GridAdsComponent;
  let fixture: ComponentFixture<GridAdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridAdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
