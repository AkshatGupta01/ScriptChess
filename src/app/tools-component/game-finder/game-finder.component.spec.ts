import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameFinderComponent } from './game-finder.component';

describe('GameFinderComponent', () => {
  let component: GameFinderComponent;
  let fixture: ComponentFixture<GameFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameFinderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
