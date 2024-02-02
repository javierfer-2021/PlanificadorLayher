import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmSimulacionPlanificadorComponent } from './frm-simulacion-planificador.component';

describe('FrmSimulacionPlanificadorComponent', () => {
  let component: FrmSimulacionPlanificadorComponent;
  let fixture: ComponentFixture<FrmSimulacionPlanificadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmSimulacionPlanificadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmSimulacionPlanificadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
