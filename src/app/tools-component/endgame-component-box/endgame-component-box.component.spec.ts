import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndgameComponentBoxComponent } from './endgame-component-box.component';

describe('EndgameComponentBoxComponent', () => {
  let component: EndgameComponentBoxComponent;
  let fixture: ComponentFixture<EndgameComponentBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndgameComponentBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndgameComponentBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
