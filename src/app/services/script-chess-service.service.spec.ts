import { TestBed } from '@angular/core/testing';

import { ScriptChessServiceService } from './script-chess-service.service';

describe('ScriptChessServiceService', () => {
  let service: ScriptChessServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScriptChessServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
