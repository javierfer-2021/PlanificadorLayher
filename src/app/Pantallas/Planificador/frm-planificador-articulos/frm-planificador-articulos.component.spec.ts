import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmPlanificadorArticulosComponent } from './frm-planificador-articulos.component';

describe('FrmPlanificadorArticulosComponent', () => {
  let component: FrmPlanificadorArticulosComponent;
  let fixture: ComponentFixture<FrmPlanificadorArticulosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmPlanificadorArticulosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmPlanificadorArticulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
