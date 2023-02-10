import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmVentasImportarComponent } from './frm-ventas-importar.component';

describe('FrmVentasImportarComponent', () => {
  let component: FrmVentasImportarComponent;
  let fixture: ComponentFixture<FrmVentasImportarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmVentasImportarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmVentasImportarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
