import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovesWithSideMoveComponent } from './moves-with-side-move.component';

describe('MovesWithSideMoveComponent', () => {
  let component: MovesWithSideMoveComponent;
  let fixture: ComponentFixture<MovesWithSideMoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovesWithSideMoveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovesWithSideMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
