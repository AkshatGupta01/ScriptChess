import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLabelComponent } from './game-label.component';

describe('GameLabelComponent', () => {
  let component: GameLabelComponent;
  let fixture: ComponentFixture<GameLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
