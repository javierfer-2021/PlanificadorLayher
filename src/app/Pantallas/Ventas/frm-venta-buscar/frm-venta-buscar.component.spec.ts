import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmVentaBuscarComponent } from './frm-venta-buscar.component';

describe('FrmVentaBuscarComponent', () => {
  let component: FrmVentaBuscarComponent;
  let fixture: ComponentFixture<FrmVentaBuscarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmVentaBuscarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmVentaBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
