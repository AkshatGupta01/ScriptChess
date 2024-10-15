import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLabelListBoxComponent } from './game-label-list-box.component';

describe('GameLabelListBoxComponent', () => {
  let component: GameLabelListBoxComponent;
  let fixture: ComponentFixture<GameLabelListBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameLabelListBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameLabelListBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
