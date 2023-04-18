import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmPlanificadorComponent } from './frm-planificador.component';

describe('FrmPlanificadorComponent', () => {
  let component: FrmPlanificadorComponent;
  let fixture: ComponentFixture<FrmPlanificadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmPlanificadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmPlanificadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
