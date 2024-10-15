import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsByCategoryComponent } from './collections-by-category.component';

describe('CollectionsByCategoryComponent', () => {
  let component: CollectionsByCategoryComponent;
  let fixture: ComponentFixture<CollectionsByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionsByCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionsByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
