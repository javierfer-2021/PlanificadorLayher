import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmIncidenciaContratosAfectadosComponent } from './frm-incidencia-contratos-afectados.component';

describe('FrmIncidenciaContratosAfectadosComponent', () => {
  let component: FrmIncidenciaContratosAfectadosComponent;
  let fixture: ComponentFixture<FrmIncidenciaContratosAfectadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmIncidenciaContratosAfectadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmIncidenciaContratosAfectadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
