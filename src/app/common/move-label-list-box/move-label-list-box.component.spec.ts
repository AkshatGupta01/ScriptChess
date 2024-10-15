import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveLabelListBoxComponent } from './move-label-list-box.component';

describe('MoveLabelListBoxComponent', () => {
  let component: MoveLabelListBoxComponent;
  let fixture: ComponentFixture<MoveLabelListBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveLabelListBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveLabelListBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
