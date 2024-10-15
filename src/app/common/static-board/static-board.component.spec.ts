import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticBoardComponent } from './static-board.component';

describe('StaticBoardComponent', () => {
  let component: StaticBoardComponent;
  let fixture: ComponentFixture<StaticBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaticBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
