import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesDownloadComponent } from './games-download.component';

describe('GamesDownloadComponent', () => {
  let component: GamesDownloadComponent;
  let fixture: ComponentFixture<GamesDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamesDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
