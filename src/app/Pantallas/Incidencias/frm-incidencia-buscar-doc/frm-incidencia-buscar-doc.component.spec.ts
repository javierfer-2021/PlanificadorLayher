import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmIncidenciaBuscarDocComponent } from './frm-incidencia-buscar-doc.component';

describe('FrmIncidenciaBuscarDocComponent', () => {
  let component: FrmIncidenciaBuscarDocComponent;
  let fixture: ComponentFixture<FrmIncidenciaBuscarDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmIncidenciaBuscarDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmIncidenciaBuscarDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
