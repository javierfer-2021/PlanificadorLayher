import { TestBed } from '@angular/core/testing';

import { PeticionesGeneralesService } from './peticiones-generales.service';

describe('PeticionesGeneralesService', () => {
  let service: PeticionesGeneralesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeticionesGeneralesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
