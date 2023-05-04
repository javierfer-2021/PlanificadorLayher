import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmIncidenciaBuscarArtComponent } from './frm-incidencia-buscar-art.component';

describe('FrmIncidenciaBuscarArtComponent', () => {
  let component: FrmIncidenciaBuscarArtComponent;
  let fixture: ComponentFixture<FrmIncidenciaBuscarArtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmIncidenciaBuscarArtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmIncidenciaBuscarArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
