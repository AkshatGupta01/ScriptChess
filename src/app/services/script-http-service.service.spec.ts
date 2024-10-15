import { TestBed } from '@angular/core/testing';

import { ScriptHttpServiceService } from './script-http-service.service';

describe('ScriptHttpServiceService', () => {
  let service: ScriptHttpServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScriptHttpServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
