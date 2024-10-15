import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyChessComponent } from './study-chess.component';

describe('StudyChessComponent', () => {
  let component: StudyChessComponent;
  let fixture: ComponentFixture<StudyChessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudyChessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyChessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
