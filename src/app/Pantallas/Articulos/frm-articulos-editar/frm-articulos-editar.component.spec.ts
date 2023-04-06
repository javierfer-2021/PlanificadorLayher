import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmArticulosEditarComponent } from './frm-articulos-editar.component';

describe('FrmArticulosEditarComponent', () => {
  let component: FrmArticulosEditarComponent;
  let fixture: ComponentFixture<FrmArticulosEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmArticulosEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmArticulosEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
