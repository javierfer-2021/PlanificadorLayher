import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmIncidenciaLineaComponent } from './frm-incidencia-linea.component';

describe('FrmIncidenciaLineaComponent', () => {
  let component: FrmIncidenciaLineaComponent;
  let fixture: ComponentFixture<FrmIncidenciaLineaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmIncidenciaLineaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmIncidenciaLineaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
