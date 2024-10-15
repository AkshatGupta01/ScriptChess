import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgnPlayerComponent } from './pgn-player.component';

describe('PgnPlayerComponent', () => {
  let component: PgnPlayerComponent;
  let fixture: ComponentFixture<PgnPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PgnPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PgnPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
