import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmConexionesComponent } from './frm-conexiones.component';

describe('FrmConexionesComponent', () => {
  let component: FrmConexionesComponent;
  let fixture: ComponentFixture<FrmConexionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmConexionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmConexionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
