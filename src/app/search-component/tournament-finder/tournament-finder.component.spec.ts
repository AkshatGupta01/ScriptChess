import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentFinderComponent } from './tournament-finder.component';

describe('TournamentFinderComponent', () => {
  let component: TournamentFinderComponent;
  let fixture: ComponentFixture<TournamentFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentFinderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
