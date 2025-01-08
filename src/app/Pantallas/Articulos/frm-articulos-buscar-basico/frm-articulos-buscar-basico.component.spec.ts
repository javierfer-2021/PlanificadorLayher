import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmArticulosBuscarBasicoComponent } from './frm-articulos-buscar-basico.component';

describe('FrmArticulosBuscarBasicoComponent', () => {
  let component: FrmArticulosBuscarBasicoComponent;
  let fixture: ComponentFixture<FrmArticulosBuscarBasicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmArticulosBuscarBasicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmArticulosBuscarBasicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
