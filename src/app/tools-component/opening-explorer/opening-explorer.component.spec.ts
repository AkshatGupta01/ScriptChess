import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningExplorerComponent } from './opening-explorer.component';

describe('OpeningExplorerComponent', () => {
  let component: OpeningExplorerComponent;
  let fixture: ComponentFixture<OpeningExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpeningExplorerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeningExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
