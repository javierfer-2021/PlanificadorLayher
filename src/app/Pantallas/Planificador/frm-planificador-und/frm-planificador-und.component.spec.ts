import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmPlanificadorUndComponent } from './frm-planificador-und.component';

describe('FrmPlanificadorUndComponent', () => {
  let component: FrmPlanificadorUndComponent;
  let fixture: ComponentFixture<FrmPlanificadorUndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmPlanificadorUndComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmPlanificadorUndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
