import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmIncidenciaImportarLineasComponent } from './frm-incidencia-importar-lineas.component';

describe('FrmIncidenciaImportarLineasComponent', () => {
  let component: FrmIncidenciaImportarLineasComponent;
  let fixture: ComponentFixture<FrmIncidenciaImportarLineasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmIncidenciaImportarLineasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmIncidenciaImportarLineasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
