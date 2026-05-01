import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmBuscarLineaArticuloComponent } from './frm-buscar-linea-articulo.component';

describe('FrmBuscarLineaArticuloComponent', () => {
  let component: FrmBuscarLineaArticuloComponent;
  let fixture: ComponentFixture<FrmBuscarLineaArticuloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmBuscarLineaArticuloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmBuscarLineaArticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
