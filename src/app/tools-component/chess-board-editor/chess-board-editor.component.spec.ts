import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessBoardEditorComponent } from './chess-board-editor.component';

describe('ChessBoardEditorComponent', () => {
  let component: ChessBoardEditorComponent;
  let fixture: ComponentFixture<ChessBoardEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChessBoardEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessBoardEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
