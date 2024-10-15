import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndgameFinderComponent } from './endgame-finder.component';

describe('EndgameFinderComponent', () => {
  let component: EndgameFinderComponent;
  let fixture: ComponentFixture<EndgameFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndgameFinderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndgameFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
