import { TestBed } from '@angular/core/testing';

import { ShippoService } from './shippo.service';

describe('ShippoService', () => {
  let service: ShippoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
