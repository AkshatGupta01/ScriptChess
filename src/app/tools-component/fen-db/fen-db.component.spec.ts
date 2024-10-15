import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FenDbComponent } from './fen-db.component';

describe('FenDbComponent', () => {
  let component: FenDbComponent;
  let fixture: ComponentFixture<FenDbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FenDbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FenDbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
