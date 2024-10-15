import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCardLongComponent } from './post-card-long.component';

describe('PostCardLongComponent', () => {
  let component: PostCardLongComponent;
  let fixture: ComponentFixture<PostCardLongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostCardLongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCardLongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
