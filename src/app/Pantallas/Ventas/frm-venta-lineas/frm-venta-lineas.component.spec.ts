import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmVentaLineasComponent } from './frm-venta-lineas.component';

describe('FrmVentaLineasComponent', () => {
  let component: FrmVentaLineasComponent;
  let fixture: ComponentFixture<FrmVentaLineasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmVentaLineasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmVentaLineasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
