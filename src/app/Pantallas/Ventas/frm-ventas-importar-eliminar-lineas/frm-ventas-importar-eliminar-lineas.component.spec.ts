import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmVentasImportarEliminarLineasComponent } from './frm-ventas-importar-eliminar-lineas.component';

describe('FrmVentasImportarEliminarLineasComponent', () => {
  let component: FrmVentasImportarEliminarLineasComponent;
  let fixture: ComponentFixture<FrmVentasImportarEliminarLineasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmVentasImportarEliminarLineasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmVentasImportarEliminarLineasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
