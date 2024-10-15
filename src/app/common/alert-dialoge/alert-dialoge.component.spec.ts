import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDialogeComponent } from './alert-dialoge.component';

describe('AlertDialogeComponent', () => {
  let component: AlertDialogeComponent;
  let fixture: ComponentFixture<AlertDialogeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertDialogeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertDialogeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
