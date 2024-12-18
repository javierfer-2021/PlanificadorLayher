import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmIncidencia2Component } from './frm-incidencia2.component';

describe('FrmIncidencia2Component', () => {
  let component: FrmIncidencia2Component;
  let fixture: ComponentFixture<FrmIncidencia2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmIncidencia2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmIncidencia2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
