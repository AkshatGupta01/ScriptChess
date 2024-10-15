import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveLabelComponent } from './move-label.component';

describe('MoveLabelComponent', () => {
  let component: MoveLabelComponent;
  let fixture: ComponentFixture<MoveLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
