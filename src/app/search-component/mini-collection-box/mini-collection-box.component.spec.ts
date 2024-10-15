import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniCollectionBoxComponent } from './mini-collection-box.component';

describe('MiniCollectionBoxComponent', () => {
  let component: MiniCollectionBoxComponent;
  let fixture: ComponentFixture<MiniCollectionBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiniCollectionBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniCollectionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
