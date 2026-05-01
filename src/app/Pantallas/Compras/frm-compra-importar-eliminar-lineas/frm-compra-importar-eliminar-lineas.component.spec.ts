import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmCompraImportarEliminarLineasComponent } from './frm-compra-importar-eliminar-lineas.component';

describe('FrmCompraImportarEliminarLineasComponent', () => {
  let component: FrmCompraImportarEliminarLineasComponent;
  let fixture: ComponentFixture<FrmCompraImportarEliminarLineasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmCompraImportarEliminarLineasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmCompraImportarEliminarLineasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
