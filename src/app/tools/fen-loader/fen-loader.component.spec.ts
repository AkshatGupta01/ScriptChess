import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FenLoaderComponent } from './fen-loader.component';

describe('FenLoaderComponent', () => {
  let component: FenLoaderComponent;
  let fixture: ComponentFixture<FenLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FenLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FenLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
