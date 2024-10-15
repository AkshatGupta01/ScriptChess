import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoobComputerComponent } from './noob-computer.component';

describe('NoobComputerComponent', () => {
  let component: NoobComputerComponent;
  let fixture: ComponentFixture<NoobComputerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoobComputerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoobComputerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
