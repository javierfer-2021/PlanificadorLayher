import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmIncidenciaComponent } from './frm-incidencia.component';

describe('FrmIncidenciaComponent', () => {
  let component: FrmIncidenciaComponent;
  let fixture: ComponentFixture<FrmIncidenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmIncidenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmIncidenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
