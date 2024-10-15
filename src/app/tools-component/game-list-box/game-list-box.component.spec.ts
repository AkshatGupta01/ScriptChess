import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameListBoxComponent } from './game-list-box.component';

describe('GameListBoxComponent', () => {
  let component: GameListBoxComponent;
  let fixture: ComponentFixture<GameListBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameListBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameListBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
