import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmIncidenciaBuscarComponent } from './frm-incidencia-buscar.component';

describe('FrmIncidenciaBuscarComponent', () => {
  let component: FrmIncidenciaBuscarComponent;
  let fixture: ComponentFixture<FrmIncidenciaBuscarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmIncidenciaBuscarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmIncidenciaBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
