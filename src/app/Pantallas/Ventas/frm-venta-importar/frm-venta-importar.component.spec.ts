import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmVentaImportarComponent } from './frm-venta-importar.component';

describe('FrmVentaImportarComponent', () => {
  let component: FrmVentaImportarComponent;
  let fixture: ComponentFixture<FrmVentaImportarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmVentaImportarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmVentaImportarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
