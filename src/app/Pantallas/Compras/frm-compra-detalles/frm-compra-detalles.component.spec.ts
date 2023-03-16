import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmCompraDetallesComponent } from './frm-compra-detalles.component';

describe('FrmCompraDetallesComponent', () => {
  let component: FrmCompraDetallesComponent;
  let fixture: ComponentFixture<FrmCompraDetallesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmCompraDetallesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmCompraDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
