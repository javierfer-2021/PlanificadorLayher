import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmArticulosBuscarComponent } from './frm-articulos-buscar.component';

describe('FrmArticulosBuscarComponent', () => {
  let component: FrmArticulosBuscarComponent;
  let fixture: ComponentFixture<FrmArticulosBuscarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmArticulosBuscarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmArticulosBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
