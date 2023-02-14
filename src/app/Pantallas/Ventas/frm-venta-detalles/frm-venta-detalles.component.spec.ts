import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmVentaDetallesComponent } from './frm-venta-detalles.component';

describe('FrmVentaDetallesComponent', () => {
  let component: FrmVentaDetallesComponent;
  let fixture: ComponentFixture<FrmVentaDetallesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmVentaDetallesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmVentaDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
