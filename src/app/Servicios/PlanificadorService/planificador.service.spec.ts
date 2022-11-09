import { TestBed } from '@angular/core/testing';

import { PlanificadorService } from './planificador.service';

describe('PlanificadorService', () => {
  let service: PlanificadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanificadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
