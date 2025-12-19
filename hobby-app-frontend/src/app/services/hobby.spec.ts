import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HobbyService } from './hobby';

describe('HobbyService', () => {
  let service: HobbyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(HobbyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
