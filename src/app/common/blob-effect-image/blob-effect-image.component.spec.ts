import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlobEffectImageComponent } from './blob-effect-image.component';

describe('BlobEffectImageComponent', () => {
  let component: BlobEffectImageComponent;
  let fixture: ComponentFixture<BlobEffectImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlobEffectImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlobEffectImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
