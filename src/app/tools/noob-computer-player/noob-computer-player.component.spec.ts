import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoobComputerPlayerComponent } from './noob-computer-player.component';

describe('NoobComputerPlayerComponent', () => {
  let component: NoobComputerPlayerComponent;
  let fixture: ComponentFixture<NoobComputerPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoobComputerPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoobComputerPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
