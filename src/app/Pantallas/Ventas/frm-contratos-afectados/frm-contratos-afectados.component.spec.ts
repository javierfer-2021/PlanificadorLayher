import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmContratosAfectadosComponent } from './frm-contratos-afectados.component';

describe('FrmContratosAfectadosComponent', () => {
  let component: FrmContratosAfectadosComponent;
  let fixture: ComponentFixture<FrmContratosAfectadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmContratosAfectadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmContratosAfectadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
