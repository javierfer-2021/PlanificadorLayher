import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmFiltrosBuscarComponent } from './frm-filtros-buscar.component';

describe('FrmFiltrosBuscarComponent', () => {
  let component: FrmFiltrosBuscarComponent;
  let fixture: ComponentFixture<FrmFiltrosBuscarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmFiltrosBuscarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmFiltrosBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
