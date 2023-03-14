import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmConfiguracionComponent } from './frm-configuracion.component';

describe('FrmConfiguracionComponent', () => {
  let component: FrmConfiguracionComponent;
  let fixture: ComponentFixture<FrmConfiguracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmConfiguracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
