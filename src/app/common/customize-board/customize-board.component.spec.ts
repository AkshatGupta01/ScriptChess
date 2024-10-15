import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeBoardComponent } from './customize-board.component';

describe('CustomizeBoardComponent', () => {
  let component: CustomizeBoardComponent;
  let fixture: ComponentFixture<CustomizeBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomizeBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
