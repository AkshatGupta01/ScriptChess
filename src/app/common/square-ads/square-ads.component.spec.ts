import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareAdsComponent } from './square-ads.component';

describe('SquareAdsComponent', () => {
  let component: SquareAdsComponent;
  let fixture: ComponentFixture<SquareAdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquareAdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquareAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
